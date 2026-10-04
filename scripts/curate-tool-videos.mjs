#!/usr/bin/env node
/**
 * Curate one concrete tutorial video per AI tool.
 *
 * Policy:
 *   1. Prefer YouTube.
 *   2. Accept a non-YouTube video only through an explicit manual override.
 *   3. Never leave a YouTube search-result placeholder in production data.
 *   4. Reject obvious name collisions and non-tutorial videos.
 */
import { readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import vm from "node:vm";

const execFileAsync = promisify(execFile);
const FILE = "tutorials/tutorial-data.js";
const CONCURRENCY = 6;
// [curate-videos] trigger full curation after matcher hardening
// [curate-videos] final manual overrides for non-YouTube fallbacks
// [curate-videos] verified Windsurf Editor match
const SEARCH_LIMIT = 10;

const MANUAL_OVERRIDES = {
  "文心助手": {
    type: "external",
    platform: "bilibili",
    title: "〖AI主播-LLM篇〗接入 文心一言 官方API（ERNIE-Bot）",
    source: "Love丶伊卡洛斯 · Bilibili",
    sourceType: "精选教程",
    url: "https://www.bilibili.com/video/BV1Sb4y1T7fv/",
    embedUrl: "https://player.bilibili.com/player.html?bvid=BV1Sb4y1T7fv&p=1&autoplay=0&danmaku=0&high_quality=1",
    note: "直接围绕文心一言（ERNIE-Bot）进行接入与配置演示，比泛泛介绍百度产品更对板。"
  },
  "Beautiful.ai": {
    type: "youtube",
    videoId: "YiWrqmembVo",
    title: "Document to AI Presentation (Beautiful.ai 3.0 Tutorial)",
    source: "Kevin Stratvert",
    sourceType: "精选教程",
    url: "https://www.youtube.com/watch?v=YiWrqmembVo",
    note: "2026 年直接演示 Beautiful.ai 3.0 的 AI 演示文稿工作流，包含创建、编辑、动画、协作与从文档生成演示文稿。"
  },
  "通义灵码": {
    type: "external",
    platform: "bilibili",
    title: "手把手看通义灵码如何从0到1构建Web页面",
    source: "杭州黄老师 · Bilibili",
    sourceType: "精选教程",
    url: "https://www.bilibili.com/video/BV1DFfeB4EA8/",
    embedUrl: "https://player.bilibili.com/player.html?bvid=BV1DFfeB4EA8&p=1&autoplay=0&danmaku=0&high_quality=1",
    note: "2026 年直接用真实项目从零演示通义灵码构建 Web 页面，包含从新建项目开始的实际操作，更适合当前版本入门。"
  },
  "Windsurf": {
    type: "youtube",
    videoId: "CLRupjhEFm8",
    title: "Windsurf Editor TUTORIAL // Better than Cursor? (yes)",
    source: "YouTube",
    sourceType: "精选教程",
    url: "https://www.youtube.com/watch?v=CLRupjhEFm8",
    note: "直接对应 Windsurf Editor 的上手和使用流程，适合作为 AI 编程入门教程。"
  },
  "Adobe Podcast": {
    type: "youtube",
    videoId: "Ke85qbZuMl4",
    title: "How To Use Adobe Podcast To Enhance Audio (Quick Guide)",
    source: "SolveBase",
    sourceType: "精选教程",
    url: "https://www.youtube.com/watch?v=Ke85qbZuMl4",
    note: "直接对应 Adobe Podcast 的音频增强功能，适合作为快速入门视频。"
  },
  "CodeGeeX": {
    type: "external",
    platform: "bilibili",
    title: "CodeGeeX：新手入门学AI编程神器｜项目地图、幽灵注释、代码对话、代码生成",
    source: "花叔v · Bilibili",
    sourceType: "精选教程",
    url: "https://www.bilibili.com/video/BV1GmBeYHEvH/",
    embedUrl: "https://player.bilibili.com/player.html?bvid=BV1GmBeYHEvH&p=1&autoplay=0&danmaku=0&high_quality=1",
    note: "面向新手实操 CodeGeeX，覆盖 VS Code 安装、项目分析、代码注释、生成和修改。"
  },

  "腾讯元宝": {
    type: "external",
    platform: "bilibili",
    title: "腾讯元宝的8个隐藏用法，用对了事半功倍",
    source: "一枚卓子 · Bilibili",
    sourceType: "精选教程",
    url: "https://www.bilibili.com/video/BV1HCTuz8EKA/",
    embedUrl: "https://player.bilibili.com/player.html?bvid=BV1HCTuz8EKA&p=1&autoplay=0&danmaku=0&high_quality=1",
    note: "围绕腾讯元宝实际使用功能的教程，适合作为入门后的第一批实操视频。"
  },
  "智谱清言": {
    type: "youtube",
    videoId: "0GRNUJvredM",
    title: "智谱清言 新AI助手：雅思、论文、英语听力，最好的中文大模型？",
    source: "我是你的网友谢谢",
    sourceType: "精选教程",
    url: "https://www.youtube.com/watch?v=0GRNUJvredM",
    note: "直接演示智谱清言的核心使用场景，适合作为认识工具和第一次上手的教程。"
  },
  "WolframAlpha": {
    type: "youtube",
    videoId: "BuTLtkkyl2c",
    title: "Wolfram Alpha Video Tutorial",
    source: "YouTube",
    sourceType: "精选教程",
    url: "https://www.youtube.com/watch?v=BuTLtkkyl2c",
    note: "直接对应 Wolfram|Alpha 的使用教程，适合新手先认识查询和计算方式。"
  },
  "Cline": {
    type: "external",
    platform: "bilibili",
    title: "VScode+Cline入门到精通(一)集成和计算器实战演练",
    source: "喜欢Ai的北京80后程序员寒山CxyHanShan · Bilibili",
    sourceType: "精选教程",
    url: "https://www.bilibili.com/video/BV1oWw6eiExe/",
    embedUrl: "https://player.bilibili.com/player.html?bvid=BV1oWw6eiExe&p=1&autoplay=0&danmaku=0&high_quality=1",
    note: "Cline 系列第一集，专门讲集成和基本使用，并用实战演示功能。"
  }
};

const ALIASES = {
  "DeepSeek": ["deepseek"],
  "豆包": ["doubao ai", "doubao"],
  "Kimi": ["kimi ai", "kimi"],
  "通义千问": ["qwen ai", "qwen"],
  "文心助手": ["ernie bot", "ernie"],
  "智谱清言": ["zhipu qingyan", "chatglm"],
  "Groq": ["groq ai", "groq"],
  "Google Translate": ["google translate"],
  "Microsoft Designer": ["microsoft designer"],
  "QuillBot": ["quillbot"],
  "DeepL": ["deepl"],
  "Ideogram": ["ideogram ai", "ideogram"],
  "Canva": ["canva"],
  "PhotoRoom": ["photoroom"],
  "Pika": ["pika ai", "pika"],
  "Luma Dream Machine": ["luma dream machine", "dream machine"],
  "TTSMaker": ["ttsmaker"],
  "PlayHT": ["playht"],
  "Suno": ["suno ai", "suno"],
  "Udio": ["udio"],
  "Soundraw": ["soundraw"],
  "Gamma": ["gamma ai", "gamma"],
  "Napkin AI": ["napkin ai", "napkin"],
  "Fireflies.ai": ["fireflies ai"],
  "Jan": ["jan ai"],
  "GPT4All": ["gpt4all"],
  "LM Studio": ["lm studio"],
  "Fooocus": ["fooocus"],
  "Stable Diffusion": ["stable diffusion"],
  "CodeGeeX": ["codegeex"],
  "通义灵码": ["tongyi lingma", "lingma", "通义灵码"],
  "Phind": ["phind"],
  "Symbolab": ["symbolab"],
  "Hugging Face": ["hugging face"],
  "即梦AI": ["即梦 ai", "即梦ai", "jimeng ai"],
  "SeaArt AI": ["seaart ai", "seaart"],
  "Tensor.Art": ["tensor art"],
  "Mage.space": ["mage space"],
  "Craiyon": ["craiyon"],
  "Playground": ["playground ai"],
  "Clipdrop": ["clipdrop"],
  "Cleanup.pictures": ["cleanup pictures", "cleanup.pictures"],
  "Remove.bg": ["remove bg", "remove.bg"],
  "OpusClip": ["opusclip"],
  "VEED": ["veed io", "veed"],
  "InVideo AI": ["invideo ai"],
  "Grok": ["grok ai", "grok"],
  "Meta AI": ["meta ai"],
  "Character.AI": ["character ai"],
  "Pi": ["pi ai"],
  "You.com": ["you com", "you.com"],
  "Manus": ["manus ai", "manus"],
  "Replika": ["replika ai", "replika"],
  "Monica": ["monica ai"],
  "Consensus": ["consensus ai"],
  "Elicit": ["elicit ai", "elicit"],
  "scite": ["scite ai"],
  "Genspark": ["genspark ai", "genspark"],
  "Felo": ["felo ai", "felo"],
  "Exa": ["exa ai", "exa"],
  "Tavily": ["tavily"],
  "WolframAlpha": ["wolframalpha", "wolfram alpha"],
  "Brave Search": ["brave search"],
  "Notion AI": ["notion ai"],
  "Jasper": ["jasper ai"],
  "Copy.ai": ["copy ai"],
  "Writesonic": ["writesonic"],
  "Rytr": ["rytr"],
  "Wordtune": ["wordtune"],
  "LanguageTool": ["languagetool"],
  "Anyword": ["anyword"],
  "Sudowrite": ["sudowrite"],
  "Midjourney": ["midjourney"],
  "Krea": ["krea ai", "krea"],
  "Recraft": ["recraft ai", "recraft"],
  "Freepik AI": ["freepik ai"],
  "OpenArt": ["openart ai", "openart"],
  "Pixlr AI": ["pixlr ai"],
  "getimg.ai": ["getimg ai", "getimg"],
  "Magnific AI": ["magnific ai", "magnific"],
  "Dzine": ["dzine ai", "dzine"],
  "Hedra": ["hedra ai", "hedra"],
  "Synthesia": ["synthesia ai", "synthesia"],
  "Captions": ["captions ai", "captions"],
  "Vizard": ["vizard ai"],
  "Wisecut": ["wisecut ai", "wisecut"],
  "Vidnoz AI": ["vidnoz ai"],
  "Riverside": ["riverside fm", "riverside"],
  "Krisp": ["krisp ai", "krisp"],
  "Adobe Podcast": ["adobe podcast"],
  "Windsurf": ["windsurf editor"],
  "Bolt.new": ["bolt new", "bolt.new"],
  "Lovable": ["lovable ai", "lovable"],
  "v0": ["v0 vercel", "v0 by vercel"],
  "Amazon Q Developer": ["amazon q developer"],
  "Tabnine": ["tabnine"],
  "Continue": ["continue ai", "continue dev"],
  "Cline": ["cline ai", "cline"],
  "Roo Code": ["roo code"],
  "OpenHands": ["openhands"],
  "Devin": ["devin ai", "devin"],
  "OpenRouter": ["openrouter"],
  "Replicate": ["replicate ai", "replicate"],
  "Together AI": ["together ai"],
  "Fireworks AI": ["fireworks ai"],
  "Cerebras": ["cerebras ai", "cerebras"],
  "ModelScope": ["modelscope"],
  "Kaggle Models": ["kaggle models"],
  "vLLM": ["vllm"],
  "llama.cpp": ["llama cpp", "llama.cpp"],
  "AnythingLLM": ["anythingllm", "anything llm"],
  "Open WebUI": ["open webui"],
  "LocalAI": ["localai", "local ai"],
  "KoboldCpp": ["koboldcpp", "kobold cpp"],
  "Msty": ["msty ai", "msty"],
  "Pinokio": ["pinokio ai", "pinokio"],
  "Google Antigravity": ["google antigravity"]
};

const TUTORIAL_WORDS = [
  "tutorial", "guide", "beginner", "beginners", "getting started",
  "how to", "walkthrough", "quickstart", "introduction", "lesson",
  "course", "setup", "set up", "step by step",
  "教程", "入门", "新手", "指南", "教学", "教學", "快速上手",
  "从入门", "从零开始", "实战", "使用", "详细讲解", "保姆级",
  "全教程", "完整教程", "操作", "教你", "如何用", "干货"
];

const NEGATIVE_WORDS = [
  "national park", "travel guide", "sci te", "le tee", "music tutorial",
  "podcast", "interview", "news", "headline", "release notes",
  "comparison", "versus", " vs ", "review", "top 10", "best ai tools",
  "shorts", "meme", "affiliate dashboard", "career", "jobs"
];

const SPECIAL_NEGATIVE = {
  "DeepL": ["translation service review", "four translation", "测评"],
  "Pika": ["make money", "赚钱"],
  "PhotoRoom": ["marketing", "营销"],
  "Meta AI": ["muse"],
  "文心助手": ["fine tuning", "fine-tuning", "unsloth", "lora"],
  "Character.AI": ["replace chatgpt", "碾压"],
  "Exa": ["dify"],
  "Tavily": ["n8n"],
  "Brave Search": ["beta"],
  "Replicate": ["$ millions", "millions"],
  "Felo": ["felo le tee"],
  "Captions": ["audio to captions"],
  "KoboldCpp": ["herika", "skyrim"],
  "Cerebras": ["generic ai coding assistant"],
  "ModelScope": ["ai videos"],
  "Tabnine": ["codex", "hugging face"],
  "Continue": ["cline + continue", "cline"],
  "Roo Code": ["system prompt"],
  "Krea": ["video"],
  "Freepik AI": ["ai image"],
  "OpenArt": ["chatgpt"],
  "LanguageTool": ["affiliate"],
  "Sudowrite": ["review"]
};

function loadProfiles(source) {
  const sandbox = { window: { tutorialProfiles: {} } };
  vm.runInNewContext(source, sandbox, { timeout: 5000 });
  return sandbox.window.tutorialProfiles;
}

function normalize(text = "") {
  return String(text).toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function aliasesFor(name) {
  return ALIASES[name] || [normalize(name)];
}

function hasAlias(name, title) {
  const t = normalize(title);
  return aliasesFor(name).some(alias => {
    const a = normalize(alias);
    return a && t.includes(a);
  });
}

function hasTutorialMarker(title) {
  const t = normalize(title);
  return TUTORIAL_WORDS.some(word => t.includes(normalize(word)));
}

function hasNegative(name, title) {
  const t = normalize(title);
  const globalBad = NEGATIVE_WORDS.some(word => t.includes(normalize(word)));
  const special = (SPECIAL_NEGATIVE[name] || []).some(word => t.includes(normalize(word)));
  return globalBad || special;
}

function candidateScore(name, title, channel = "") {
  if (!hasAlias(name, title)) return -10000;
  if (!hasTutorialMarker(title)) return -9000;
  if (hasNegative(name, title)) return -8000;

  const t = normalize(title);
  const exact = aliasesFor(name).some(alias => {
    const a = normalize(alias);
    return a && t === a;
  });
  let score = exact ? 120 : 80;

  for (const marker of TUTORIAL_WORDS) {
    if (t.includes(normalize(marker))) score += 10;
  }
  if (/official|官方|wolfram|github|microsoft|google|anthropic|openai|adobe|amazon/i.test(channel)) score += 10;
  if (t.includes("2026")) score += 4;
  return score;
}

async function ytSearch(query) {
  const { stdout } = await execFileAsync("python", [
    "-m", "yt_dlp", "-J", "--flat-playlist", "--no-warnings", "--ignore-errors",
    "--skip-download", `ytsearch${SEARCH_LIMIT}:${query}`
  ], { maxBuffer: 12 * 1024 * 1024, timeout: 35000 });
  const payload = JSON.parse(stdout);
  return Array.isArray(payload.entries) ? payload.entries.filter(Boolean) : [];
}

async function fetchText(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AI-Starter-Hub video checker/1.0)",
        "Accept-Language": "en-US,en;q=0.9"
      },
      signal: controller.signal
    });
    const text = await response.text();
    return { response, text };
  } finally {
    clearTimeout(timer);
  }
}

async function validateVideo(video) {
  if (!video) return { ok: false, reason: "empty" };

  if (video.type === "external") {
    const sourceUrl = String(video.url || "");
    const embedUrl = String(video.embedUrl || "");
    if (!sourceUrl || !embedUrl) return { ok: false, reason: "missing-external-url" };

    try {
      const { stdout } = await execFileAsync("python", [
        "-m", "yt_dlp", "-J", "--no-warnings", "--skip-download", sourceUrl
      ], {
        maxBuffer: 8 * 1024 * 1024,
        timeout: 45000
      });
      const info = JSON.parse(stdout);
      const formats = Array.isArray(info.formats) ? info.formats : [];
      if (!formats.length && !info.url) return { ok: false, reason: "no-playable-format" };

      const embedded = await fetchText(embedUrl, 15000);
      if (!embedded.response.ok) return { ok: false, reason: `embed-http:${embedded.response.status}` };

      return {
        ok: true,
        title: String(info.title || video.title || ""),
        duration: Number(info.duration || 0)
      };
    } catch (error) {
      return { ok: false, reason: error?.name === "AbortError" ? "external-timeout" : (error?.message || "external-check-failed") };
    }
  }

  const expectedId = String(video.videoId || "");
  if (!expectedId) return { ok: false, reason: "missing-youtube-id" };

  const embedUrl = `https://www.youtube.com/embed/${encodeURIComponent(expectedId)}?rel=0&playsinline=1&modestbranding=1`;
  try {
    const embedded = await fetchText(embedUrl, 15000);
    if (!embedded.response.ok) return { ok: false, reason: `embed-http:${embedded.response.status}` };

    const html = embedded.text;
    const statusMatch =
      html.match(/"playabilityStatus"\\s*:\\s*\\{\\s*"status"\\s*:\\s*"([A-Z_]+)"/) ||
      html.match(/"status"\\s*:\\s*"(OK|UNPLAYABLE|ERROR|LOGIN_REQUIRED|AGE_CHECK_REQUIRED|AGE_VERIFICATION_REQUIRED)"/);
    const status = statusMatch?.[1] || "";

    if (status === "ERROR" || status === "UNPLAYABLE" || status === "LOGIN_REQUIRED") {
      return { ok: false, reason: `youtube-playability:${status}` };
    }
    if (/This video is unavailable|Video unavailable|This video is private|This video is no longer available/i.test(html)) {
      return { ok: false, reason: "youtube-unavailable" };
    }
    if (/"playableInEmbed"\\s*:\\s*false/i.test(html) || /"playable_in_embed"\\s*:\\s*false/i.test(html)) {
      return { ok: false, reason: "embed-disabled" };
    }
    return { ok: true, title: video.title || "", playability: status || "unknown" };
  } catch (error) {
    return { ok: false, reason: error?.name === "AbortError" ? "embed-timeout" : (error?.message || "youtube-check-failed") };
  }
}


async function pickVideo(name, profile, { forceSearch = false } = {}) {
  const manual = MANUAL_OVERRIDES[name];
  if (manual && !forceSearch) {
    const check = await validateVideo(manual);
    if (check.ok) return manual;
    console.warn(`[manual invalid] ${name} · ${check.reason}`);
  }

  if (!forceSearch) {
    for (const current of profile.videos || []) {
      const check = await validateVideo(current);
      if (check.ok) return current;
      console.warn(`[video invalid] ${name} · ${current.title || current.videoId || current.url} · ${check.reason}`);
    }
  }

  const alias = aliasesFor(name)[0];
  const queries = [
    `"${alias}" tutorial beginner`,
    `"${alias}" how to use guide`,
    `${alias} 教程 新手`,
    `${alias} 使用 教程`
  ];

  const seen = new Set();
  const candidates = [];

  for (const query of queries) {
    try {
      for (const item of await ytSearch(query)) {
        const id = item.id || "";
        if (!id || seen.has(id)) continue;
        seen.add(id);
        const title = item.title || "";
        const score = candidateScore(name, title, item.channel || item.uploader || "");
        if (score < 40) continue;
        candidates.push({
          id,
          title,
          channel: item.channel || item.uploader || "YouTube",
          url: item.webpage_url || `https://www.youtube.com/watch?v=${id}`,
          score
        });
      }
    } catch (error) {
      console.warn(`[search failed] ${name} · ${query} · ${error.message}`);
    }
    candidates.sort((a, b) => b.score - a.score);
    if (candidates.length && candidates[0].score >= 115) break;
  }

  candidates.sort((a, b) => b.score - a.score);
  for (const chosen of candidates) {
    const candidate = {
      type: "youtube",
      videoId: chosen.id,
      title: chosen.title,
      source: chosen.channel,
      sourceType: /official|官方/i.test(chosen.channel) ? "官方教程" : "精选教程",
      url: chosen.url,
      note: `视频标题明确对应“${name}”，并带有教程/上手/实战类教学信号。`
    };
    const check = await validateVideo(candidate);
    if (check.ok) return candidate;
    console.warn(`[candidate invalid] ${name} · ${candidate.title} · ${check.reason}`);
  }

  return null;
}

async function mapConcurrent(items, worker) {
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

console.log(`Profiles: ${entries.length}; validating every tutorial video entry...`);

const checked = await mapConcurrent(entries, async ([name, profile]) => {
  const videos = Array.isArray(profile.videos) ? profile.videos : [];
  const valid = [];
  for (const video of videos) {
    const check = await validateVideo(video);
    if (check.ok) {
      valid.push(video);
      console.log(`[PASS] ${name} -> ${video.title || video.videoId || video.url}`);
    } else {
      console.warn(`[FAIL] ${name} -> ${video.title || video.videoId || video.url} · ${check.reason}`);
    }
  }

  if (valid.length) {
    profile.videos = valid;
    return { name, repaired: false, video: valid[0], removed: videos.length - valid.length };
  }

  const repaired = await pickVideo(name, profile, { forceSearch: true });
  if (repaired) {
    profile.videos = [repaired];
    console.log(`[REPAIRED] ${name} -> ${repaired.title} | ${repaired.videoId || repaired.platform}`);
    return { name, repaired: true, video: repaired, removed: videos.length };
  }

  return { name, repaired: true, video: null, removed: videos.length };
});

const missing = checked.filter(item => !item.video).map(item => item.name);
const repaired = checked.filter(item => item.repaired);
const removed = checked.reduce((sum, item) => sum + Number(item.removed || 0), 0);

if (missing.length) {
  console.error(`No playable tutorial video for: ${missing.join(", ")}`);
  process.exit(2);
}

const output = "/* AI Starter Hub · tool-specific bilingual beginner guide data */\n" +
  "window.tutorialProfiles = " + JSON.stringify(profiles) + ";\n";
await writeFile(FILE, output, "utf8");
console.log(JSON.stringify({
  profiles: entries.length,
  repairedTools: repaired.length,
  removedInvalidEntries: removed,
  finalVideoEntries: entries.reduce((sum, [, profile]) => sum + (profile.videos || []).length, 0)
}, null, 2));

// [curate-videos] re-run direct embed validation before keeping it
