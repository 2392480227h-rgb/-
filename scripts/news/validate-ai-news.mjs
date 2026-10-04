#!/usr/bin/env node
import { readFile } from "node:fs/promises";

const file = new URL("../../data/ai-news.json", import.meta.url);
const raw = await readFile(file, "utf8");
const feed = JSON.parse(raw);

if (!Array.isArray(feed.items)) throw new Error("data/ai-news.json: items must be an array");
if (feed.items.length === 0) throw new Error("data/ai-news.json: feed is empty");

const ids = new Set();
const urls = new Set();
for (const [index, item] of feed.items.entries()) {
  const n = index + 1;
  for (const key of ["id", "title", "source", "url", "publishedAt"]) {
    if (!item[key] || typeof item[key] !== "string") {
      throw new Error(`item ${n}: missing string field ${key}`);
    }
  }
  if (ids.has(item.id)) throw new Error(`duplicate id: ${item.id}`);
  if (urls.has(item.url)) throw new Error(`duplicate url: ${item.url}`);
  ids.add(item.id);
  urls.add(item.url);

  const url = new URL(item.url);
  if (!/^https?:$/.test(url.protocol)) throw new Error(`item ${n}: invalid protocol`);
  if (!["major", "update", "abstract"].includes(item.type)) throw new Error(`item ${n}: invalid type`);
}

console.log(`AI NOW feed OK: ${feed.items.length} items`);
