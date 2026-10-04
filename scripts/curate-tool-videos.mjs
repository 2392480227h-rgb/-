#!/usr/bin/env node
/**
 * One-off / manual video curation for AI Starter Hub.
 *
 * Finds a concrete YouTube tutorial for every tool profile that currently
 * uses a search placeholder or a non-YouTube video. The site embeds only
 * concrete video IDs, never YouTube search-result pages.
 *
 * Run in GitHub Actions where yt-dlp is installed:
 *   python -m yt_dlp ...
 */
import { readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import vm from "node:vm";

const execFileAsync = promisify(execFile);
const FILE = "tutorials/tutorial-data.js";
const CONCURRENCY = 6; // [curate-videos] one-shot trigger
const SEARCH_LIMIT = 8;

const ALIASES = {
  "豆包": "豆包 AI",
  "Kimi": "Kimi AI",
  "通义千问": "Qwen AI",
  "文心助手": "ERNIE Bot",
  "腾讯元宝": "Tencent Yuanbao AI",
  "智谱清言": "Zhipu Qingyan AI",
  "Groq": "Groq AI",
  "Playground": "Playground AI",
  "Pi": "Pi AI",
  "Jan": "Jan AI",
  "You.com": "You.com AI",
  "Manus": "Manus AI",
  "Monica": "Monica AI",
  "Gamma": "Gamma AI",
  "Hedra": "Hedra AI",
  "Windsurf": "Windsurf Editor",
  "v0": "v0 by Vercel",
  "Continue": "Continue.dev",
  "Cline": "Cline AI coding",
  "Roo Code": "Roo Code",
  "Devin": "Devin AI",
  "OpenRouter": "OpenRouter AI",
  "Replicate": "Replicate AI",
  "Together AI": "Together AI",
  "Fireworks AI": "Fireworks AI",
  "Cerebras": "Cerebras AI",
  "ModelScope": "ModelScope AI",
  "Kaggle Models": "Kaggle Models",
  "vLLM": "vLLM",
  "llama.cpp": "llama.cpp",
  "Open WebUI": "Open WebUI",
  "LocalAI": "LocalAI",
  "KoboldCpp": "KoboldCpp",
  "Msty": "Msty AI",
  "Pinokio": "Pinokio AI",
  "Google Antigravity": "Google Antigravity",
  "Microsoft Designer": "Microsoft Designer AI"
};

const TUTORIAL_WORDS = [
  "tutorial", "guide", "beginner", "beginners", "getting started",
  "how to", "walkthrough", "quickstart", "introduction", "lesson",
  "course", "setup", "set up", "使用", "教程", "入门", "新手", "指南",
  "教学", "教學", "快速上手", "从入门", "从零开始"
];
const NEGATIVE_WORDS = [
  "news", "headline", "release notes", "comparison", "vs ", "versus",
  "top 10", "best ai tools", "shorts", "podcast", "interview", "review"
];

function loadProfiles(source) {
  const window = { tutorialProfiles: {} };
  vm.runInNewContext(source, { window }, { timeout: 5000 });
  if (!window.tutorialProfiles || typeof window.tutorialProfiles !== "object") {
    throw new Error("Could not load tutorialProfiles");
  }
  return window.tutorialProfiles;
}

function normalize(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeQuery(searchUrl) {
  try {
    const url = new URL(searchUrl);
    return url.searchParams.get("search_query") || "";
  } catch {
    return "";
  }
}

function requiredAliases(name) {
  const alias = ALIASES[name] || name;
  const n = normalize(name);
  if (n === "pi") return ["pi ai", "inflection pi"];
  if (n === "jan") return ["jan ai"];
  if (n === "playground") return ["playground ai"];
  if (n === "gamma") return ["gamma ai"];
  if (n === "continue") return ["continue dev", "continue ai"];
  if (n === "v0") return ["v0 vercel", "v0 by vercel"];
  return [normalize(alias)];
}

function tokenScore(name, title, query) {
  const titleN = normalize(title);
  const aliases = requiredAliases(name);
  let score = 0;
  for (const alias of aliases) {
    if (!alias) continue;
    if (titleN.includes(alias)) score += 75;
    const tokens = alias.split(" ").filter(Boolean);
    const hits = tokens.filter(t => titleN.includes(t)).length;
    if (tokens.length && hits === tokens.length) score += 35;
    else if (tokens.length > 1 && hits >= Math.ceil(tokens.length / 2)) score += 15;
  }

  const titleWords = titleN.split(" ");
  const queryN = normalize(query);
  for (const word of TUTORIAL_WORDS) {
    const w = normalize(word);
    if (w && (titleN.includes(w) || queryN.includes(w))) score += 14;
  }
  for (const word of NEGATIVE_WORDS) {
    if (titleN.includes(normalize(word))) score -= 22;
  }

  if (/official|官方/i.test(title)) score += 10;
  if (/\b(ai|ai powered|artificial intelligence)\b/i.test(title)) score += 4;
  if (titleWords.length >= 4) score += 2;
  return score;
}

async function ytSearch(query) {
  const args = [
    "-J", "--flat-playlist", "--no-warnings", "--ignore-errors",
    "--skip-download", `ytsearch${SEARCH_LIMIT}:${query}`
  ];
  const { stdout } = await execFileAsync("python", ["-m", "yt_dlp", ...args], {
    maxBuffer: 8 * 1024 * 1024,
    timeout: 30000
  });
  const payload = JSON.parse(stdout);
  return Array.isArray(payload.entries) ? payload.entries.filter(Boolean) : [];
}

async function pickVideo(name, profile) {
  const first = (profile.videos || [])[0];
  const configuredQuery = first?.type === "search" ? decodeQuery(first.searchUrl || "") : "";
  const alias = ALIASES[name] || name;
  const queries = [
    configuredQuery,
    `${alias} tutorial beginner`,
    `${alias} how to use tutorial`,
    `${alias} getting started guide`
  ].filter(Boolean);

  const seen = new Set();
  let candidates = [];

  for (const query of queries) {
    try {
      const entries = await ytSearch(query);
      for (const item of entries) {
        const id = item.id || "";
        if (!id || seen.has(id)) continue;
        seen.add(id);
        const title = item.title || "";
        const score = tokenScore(name, title, query);
        candidates.push({
          id,
          title,
          channel: item.channel || item.uploader || item.creator || "YouTube",
          url: item.webpage_url || `https://www.youtube.com/watch?v=${id}`,
          score,
          query
        });
      }
    } catch (error) {
      console.warn(`[search failed] ${name} · ${query} · ${error.message}`);
    }
    candidates.sort((a, b) => b.score - a.score);
    if (candidates.length && candidates[0].score >= 105) break;
  }

  candidates.sort((a, b) => b.score - a.score);

  // Strong match: exact/alias product in title plus tutorial language.
  const chosen = candidates.find(c => {
    const titleN = normalize(c.title);
    const hasProduct = requiredAliases(name).some(a => a && titleN.includes(a));
    const hasTutorial = TUTORIAL_WORDS.some(w => titleN.includes(normalize(w)));
    return hasProduct && hasTutorial && c.score >= 100;
  }) || candidates[0];

  if (!chosen || chosen.score < 92) return null;

  return {
    type: "youtube",
    videoId: chosen.id,
    title: chosen.title,
    source: chosen.channel,
    sourceType: /official|官方/i.test(chosen.title) ? "官方教程" : "精选教程",
    url: chosen.url,
    note: `视频标题直接对应“${name}”，围绕基础使用/上手流程讲解，适合作为本站入门教程。`
  };
}

async function mapWithConcurrency(items, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function runner() {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, runner));
  return results;
}

const source = await readFile(FILE, "utf8");
const profiles = loadProfiles(source);
const entries = Object.entries(profiles);

const targets = entries.filter(([_, profile]) =>
  (profile.videos || []).some(video => video.type === "search" || video.type === "external")
);

console.log(`Profiles: ${entries.length}; targets needing concrete YouTube: ${targets.length}`);

const picked = await mapWithConcurrency(targets, async ([name, profile]) => {
  const result = await pickVideo(name, profile);
  if (result) console.log(`[OK] ${name} -> ${result.title} | ${result.videoId}`);
  else console.warn(`[MISS] ${name}`);
  return { name, result };
});

const misses = [];
for (const item of picked) {
  if (item.result) {
    profiles[item.name].videos = [item.result];
  } else {
    misses.push(item.name);
  }
}

if (misses.length) {
  console.error(`Could not find a strong YouTube tutorial match for ${misses.length} tools: ${misses.join(", ")}`);
  process.exitCode = 2;
}

// Ensure every profile has at least one concrete YouTube video.
const missingEmbed = entries
  .filter(([_, profile]) => !(profile.videos || []).some(v => v.type === "youtube" && v.videoId))
  .map(([name]) => name);

if (missingEmbed.length) {
  console.error(`No embeddable YouTube video remains for: ${missingEmbed.join(", ")}`);
  process.exitCode = 3;
}

if (process.exitCode) process.exit();

const output = "/* AI Starter Hub · tool-specific bilingual beginner guide data */\n" +
  "window.tutorialProfiles = " + JSON.stringify(profiles) + ";\n";
await writeFile(FILE, output, "utf8");
console.log(`Wrote curated video data for all ${entries.length} tools.`);
