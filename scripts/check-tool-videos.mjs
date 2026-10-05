#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const FILE = "tutorials/tutorial-data.js";
const CONCURRENCY = 8;
const TIMEOUT_MS = 15000;

function loadProfiles(source) {
  const sandbox = { window: { tutorialProfiles: {} } };
  vm.runInNewContext(source, sandbox, { timeout: 5000 });
  return sandbox.window.tutorialProfiles || {};
}

function getEmbedUrl(video) {
  if (video?.type === "external" && video.embedUrl) return String(video.embedUrl);
  if (video?.videoId && (!video.type || video.type === "youtube")) {
    return `https://www.youtube.com/embed/${encodeURIComponent(video.videoId)}?rel=0&playsinline=1&modestbranding=1`;
  }
  return "";
}

async function fetchText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": "AI-Starter-Hub/video-health-check",
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

async function checkVideo(video) {
  if (!video) return { ok: false, hard: true, reason: "empty-video" };

  const sourceUrl = String(video.url || "");
  const videoEmbed = getEmbedUrl(video);
  if (!sourceUrl || !videoEmbed) {
    return { ok: false, hard: true, reason: "missing-source-or-embed-url" };
  }

  try {
    const embedded = await fetchText(videoEmbed);
    if (!embedded.response.ok) {
      return { ok: false, hard: true, reason: `embed-http-${embedded.response.status}` };
    }

    const html = embedded.text;

    if (video.type === "external") {
      if (/视频不存在|视频已失效|稿件不存在|视频加载失败|页面不存在/i.test(html)) {
        return { ok: false, hard: true, reason: "external-video-unavailable" };
      }
    } else {
      const statusMatch =
        html.match(/"playabilityStatus"\s*:\s*\{\s*"status"\s*:\s*"([A-Z_]+)"/) ||
        html.match(/"status"\s*:\s*"(OK|UNPLAYABLE|ERROR|LOGIN_REQUIRED|AGE_CHECK_REQUIRED|AGE_VERIFICATION_REQUIRED)"/);
      const status = statusMatch?.[1] || "";
      if (["UNPLAYABLE", "ERROR", "LOGIN_REQUIRED"].includes(status)) {
        return { ok: false, hard: true, reason: `youtube-playability-${status}` };
      }
      if (/This video is unavailable|Video unavailable|This video is private|This video is no longer available/i.test(html)) {
        return { ok: false, hard: true, reason: "youtube-unavailable" };
      }
      if (/"playableInEmbed"\s*:\s*false|"playable_in_embed"\s*:\s*false/i.test(html)) {
        return { ok: false, hard: true, reason: "embed-disabled" };
      }
    }

    return { ok: true, hard: false };
  } catch (error) {
    return {
      ok: false,
      hard: false,
      reason: error?.name === "AbortError" ? "timeout" : (error?.message || "network-error")
    };
  }
}

async function mapConcurrent(items, worker) {
  const out = new Array(items.length);
  let cursor = 0;

  async function runner() {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      out[index] = await worker(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, runner));
  return out;
}

const source = await readFile(FILE, "utf8");
const profiles = loadProfiles(source);
const entries = Object.entries(profiles);

if (!entries.length) throw new Error("No tutorial profiles found");

const checks = [];
for (const [name, profile] of entries) {
  const videos = Array.isArray(profile.videos) ? profile.videos : [];
  if (!videos.length) {
    checks.push({ name, video: null, result: { ok: false, hard: true, reason: "no-videos" } });
    continue;
  }

  const results = await mapConcurrent(videos, checkVideo);
  results.forEach((result, index) => {
    checks.push({ name, video: videos[index], result });
  });
}

const hardFailures = checks.filter(item => !item.result.ok && item.result.hard);
const transientWarnings = checks.filter(item => !item.result.ok && !item.result.hard);

for (const item of checks) {
  const label = item.video?.title || item.video?.videoId || item.video?.url || "missing";
  if (item.result.ok) {
    console.log(`[PASS] ${item.name} -> ${label}`);
  } else if (item.result.hard) {
    console.error(`[FAIL] ${item.name} -> ${label} · ${item.result.reason}`);
  } else {
    console.warn(`[WARN] ${item.name} -> ${label} · ${item.result.reason}`);
  }
}

const toolsWithoutHealthyVideo = entries
  .map(([name, profile]) => {
    const videos = Array.isArray(profile.videos) ? profile.videos : [];
    const ownChecks = checks.filter(item => item.name === name);
    return [name, videos, ownChecks];
  })
  .filter(([, videos, ownChecks]) => videos.length === 0 || !ownChecks.some(item => item.result.ok));

if (hardFailures.length || toolsWithoutHealthyVideo.length) {
  console.error("");
  console.error(`Video health check failed: ${hardFailures.length} hard failure(s), ${toolsWithoutHealthyVideo.length} tool(s) without a healthy video.`);
  process.exit(1);
}

console.log("");
console.log(`Video health check passed: ${entries.length} tools, ${checks.length} video entries. ${transientWarnings.length} transient warning(s).`);
