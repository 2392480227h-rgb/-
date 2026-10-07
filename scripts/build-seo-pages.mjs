#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT=process.cwd();
const SITE="https://starterhub-dev.github.io/ai-tools/";
const APP=fs.readFileSync(path.join(ROOT,"app.js"),"utf8");
const DATA=fs.readFileSync(path.join(ROOT,"tutorials","tutorial-data.js"),"utf8");

function parseTools(source){
  const body=source.match(/const tools=\[(.*?)\n\];/s)?.[1];
  if(!body) throw new Error("Could not find tools array in app.js");
  return Function('"use strict";return ['+body+']')();
}
function parseProfiles(source){
  const sandbox={window:{}};
  vm.runInNewContext(source+"\n",sandbox,{timeout:5000});
  return sandbox.window.tutorialProfiles||{};
}
function slugify(name,internationalNames){
  const seed=internationalNames[name]||name;
  let slug=String(seed).toLowerCase()
    .replace(/&/g," and ")
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"");
  if(!slug){
    let h=2166136261;
    for(const ch of String(name)) h=Math.imul(h^ch.charCodeAt(0),16777619);
    slug="tool-"+(h>>>0).toString(36);
  }
  return slug;
}
function esc(s){
  return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
}
function attr(s){return esc(s);}
function nl2br(s){return esc(s).replace(/\n/g,"<br>");}
function ld(obj){return JSON.stringify(obj).replace(/</g,"\\u003c");}

const internationalNames={"豆包":"Doubao","通义千问":"Qwen","文心助手":"ERNIE Assistant","腾讯元宝":"Yuanbao","智谱清言":"ChatGLM","秘塔AI搜索":"Metaso","即梦AI":"Jimeng AI","通义灵码":"Qoder CN"};
const fallback={
  "chat":{learn:"从一个具体问题开始，再连续追问。",task:"完成一个真实的小任务。",prompt:"我第一次使用这个工具。请先解释任务，再给出适合零基础的步骤。"},
  "search":{learn:"搜索一个明确主题，并打开来源核对。",task:"完成一次小型资料检索。",prompt:"研究这个主题，先给结论，再给来源，并标记需要核实的地方。"},
  "image":{learn:"先写清主体、风格、画面和用途。",task:"生成第一张简单图片。",prompt:"生成一张主体明确、背景干净、适合手机屏幕的图片。"},
  "video":{learn:"先做一个最短镜头，再逐步增加复杂度。",task:"完成一次生成、剪辑或字幕任务。",prompt:"制作一个简洁短视频，主体稳定、动作自然、画面清楚。"},
  "code":{learn:"先解释一个函数，再做局部修改。",task:"完成一次解释→修改→测试。",prompt:"请解释这段代码的作用、输入输出和边界情况，然后只做最小修改。"},
  "office":{learn:"从总结、改写或整理开始。",task:"把一段杂乱内容整理成清晰结果。",prompt:"把下面内容整理成要点、待办和缺失信息。"},
  "upload":{learn:"先给资料或问题，再要求按你的水平解释。",task:"把一份资料整理成可复用笔记。",prompt:"只根据我提供的资料回答，并指出答案依据。"},
  "local":{learn:"先看电脑配置，再选择合适的小模型。",task:"完成第一次本地对话。",prompt:"这是我的电脑配置：……。请推荐适合本地运行的轻量模型，并说明原因。"},
  "model":{learn:"先看模型说明或示例，再做最小实验。",task:"完成一次模型测试。",prompt:"请用通俗语言解释这个模型的用途，并给一个真实例子。"}
};
function getProfile(tool,profiles){
  const [title,,cat,,,url]=tool;
  return profiles[title]||fallback[
    /搜索|研究/.test(cat)?"search":
    /图片|设计/.test(cat)?"image":
    /视频|音频/.test(cat)?"video":
    /编程|开发/.test(cat)?"code":
    /办公|写作/.test(cat)?"office":
    /本地/.test(cat)?"local":
    /模型/.test(cat)?"model":"chat"
  ];
}

const BUILD_DATE=new Date().toISOString().slice(0,10);
const tools=parseTools(APP);
if(!tools.length) throw new Error("No tools found");
const profiles=parseProfiles(DATA);
if(Object.keys(profiles).length!==tools.length) throw new Error("Tool/profile count mismatch: "+tools.length+" tools, "+Object.keys(profiles).length+" profiles");
const outRoot=path.join(ROOT,"tools");
fs.rmSync(outRoot,{recursive:true,force:true});
fs.mkdirSync(outRoot,{recursive:true});
const used=new Set();
const sitemap=[];
sitemap.push({loc:SITE,lastmod:BUILD_DATE});
sitemap.push({loc:SITE+"tutorials/",lastmod:BUILD_DATE});

for(const tool of tools){
  const [title,icon,cat,desc,free,url,publisher]=tool;
  let slug=slugify(title,internationalNames);
  const logoFallback=icon||"AI";
  if(used.has(slug)) slug += "-tool";
  used.add(slug);
  const p=getProfile(tool,profiles);
  const canonical=SITE+"tools/"+slug+"/";
  const videos=Array.isArray(p?.videos)?p.videos:[];
  const getEmbedUrl=v=>{
    if(v?.type==="external" && v.embedUrl) return String(v.embedUrl);
    if(v?.videoId && (!v.type || v.type==="youtube")) return "https://www.youtube-nocookie.com/embed/"+encodeURIComponent(v.videoId)+"?rel=0&playsinline=1&modestbranding=1";
    return "";
  };
  const video=videos.find(v=>getEmbedUrl(v));
  if(!video) throw new Error("No embeddable tutorial video for "+title);
  const videoEmbedUrl=getEmbedUrl(video);
  const videoWatchUrl=video.url||(video.videoId?"https://www.youtube.com/watch?v="+encodeURIComponent(video.videoId):"");
  const related=tools.filter(other=>other!==tool && other[2]===cat).slice(0,5);
  const relatedSection=related.length?'<section><h2>同类工具 / Related tools</h2><div class="seo-related">'+related.map(other=>'<a href="'+attr(SITE+"tools/"+slugify(other[0],internationalNames)+"/")+'"><strong>'+esc(other[0])+'</strong><span>'+esc(other[3])+'</span></a>').join("")+'</div></section>':"";
  const videoSection='<section><h2>教程视频 / Video tutorials</h2><p>对应教程已直接嵌入本页面，点击播放器中的 ▶ 即可观看，不需要先跳转到视频平台。若视频平台限制第三方播放，再使用下方来源页面。</p><div class="seo-video-frame"><iframe class="seo-video-player" src="'+attr(videoEmbedUrl)+'" title="'+attr(video.title||title+" 教程视频")+'" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div><div class="seo-video-meta"><strong>'+esc(video.title||"教程视频")+'</strong><span>'+esc(video.sourceType||"精选教程")+(video.source?" · "+esc(video.source):"")+'</span></div>'+(videoWatchUrl?'<a class="seo-video-source" href="'+attr(videoWatchUrl)+'" target="_blank" rel="noopener noreferrer">来源页面 ↗</a>':"")+'</section>';
  const jsonLd=[
    {"@context":"https://schema.org","@type":"WebPage","name":title+" 新手教程","description":desc+" 提供官方入口、入门步骤、第一次任务、提示词与教程视频。","url":canonical,"inLanguage":["zh-CN","en"],"isPartOf":{"@type":"WebSite","name":"AI 新手导航","url":SITE},"about":{"@type":"SoftwareApplication","name":title,"url":url,"applicationCategory":cat,"operatingSystem":"Web"}},
    {"@context":"https://schema.org","@type":"SoftwareApplication","name":title,"description":desc,"url":url,"applicationCategory":cat,"operatingSystem":"Web","publisher":{"@type":"Organization","name":publisher}},
    {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
      {"@type":"ListItem","position":1,"name":"AI 新手导航","item":SITE},
      {"@type":"ListItem","position":2,"name":"AI 工具教程","item":SITE+"tutorials/"},
      {"@type":"ListItem","position":3,"name":title,"item":canonical}
    ]}
  ];
  const html='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<meta name="robots" content="index,follow,max-image-preview:large">'+
    '<link rel="icon" href="../../favicon.svg" type="image/svg+xml">'+
    '<link rel="canonical" href="'+attr(canonical)+'">'+
    '<title>'+esc(title)+' 新手教程 | 怎么用、入门步骤与提示词 · AI Starter Hub</title>'+
    '<meta name="description" content="'+attr(desc+" AI 新手教程：官方入口、入门步骤、第一次任务、提示词与教程视频。")+'">'+
    '<meta property="og:type" content="article"><meta property="og:site_name" content="AI 新手导航 · AI Starter Hub">'+
    '<meta property="og:title" content="'+attr(title+" 新手教程 | AI Starter Hub")+'"><meta property="og:description" content="'+attr(desc)+'">'+
    '<meta property="og:url" content="'+attr(canonical)+'"><meta name="twitter:card" content="summary">'+
    '<meta name="twitter:title" content="'+attr(title+" 新手教程")+'"><meta name="twitter:description" content="'+attr(desc)+'">'+
    '<link rel="stylesheet" href="../../style.css?v=20261004-19"><link rel="stylesheet" href="../../tutorials/tutorial.css?v=20261007-1">'+
    '<script type="application/ld+json">'+ld(jsonLd)+'</script></head><body>'+
    '<header class="seo-top topbar"><div class="wrap"><a href="../../" class="seo-brand brand"><span data-icon="compass"></span><span id="pageBrand">AI Starter Hub</span></a><div style="display:flex;align-items:center;gap:10px"><a href="../../tutorials/" class="seo-back back" id="pageBack">全部教程 / Guides</a><div class="language-picker" id="pageLanguagePicker"><button id="pageLanguageButton" class="lang-button" type="button" aria-haspopup="menu" aria-expanded="false"><span class="lang-globe" aria-hidden="true">🌐</span><span id="pageLanguageLabel">语言</span><span class="lang-chevron" aria-hidden="true">⌄</span></button><div id="pageLanguageMenu" class="language-menu" role="menu" hidden><button type="button" data-language="zh">简体中文<span>简中</span></button><button type="button" data-language="zh-TW">繁體中文<span>繁中</span></button><button type="button" data-language="en">English<span>EN</span></button></div></div></div></div></header>'+
    '<main class="wrap content" id="app"><nav class="seo-breadcrumb"><a href="../../">AI 新手导航</a><span>›</span><a href="../../tutorials/">AI 工具教程</a><span>›</span><strong>'+esc(title)+'</strong></nav>'+
    '<article class="seo-article"><header class="seo-hero"><div class="seo-kicker">'+esc(cat)+' · '+esc(free)+'</div><div class="seo-title-row"><div class="seo-logo" data-brand-name="'+attr(title)+'" data-brand-url="'+attr(url)+'"><span aria-hidden="true">'+esc(logoFallback)+'</span></div><div><h1>'+esc(title)+' 新手教程</h1><p>'+esc(desc)+'</p><div class="seo-meta"><span>'+esc(publisher)+'</span><span>官方入口</span><span>新手友好</span></div></div></div></header>'+
    '<section><h2>这个工具是做什么的？ / What is it for?</h2><p>'+esc(p.learn||desc)+'</p><p>AI Starter Hub 为第一次使用者提供简明中文步骤和英文提示，实际服务、价格、免费额度与功能请以官方页面为准。</p></section>'+
    '<section><h2>第一次使用怎么做？ / First steps</h2><ol class="seo-steps"><li><b>打开官方入口</b><span>进入 '+esc(publisher)+' 的官方页面。</span></li><li><b>完成最小任务</b><span>'+esc(p.task||"先完成一个简单真实任务。")+'</span></li><li><b>检查结果</b><span>先检查事实、格式和输出质量，再继续追问或修改。</span></li></ol></section>'+
    '<section><h2>直接复制的第一次提示词 / First prompt</h2><div class="seo-prompt"><code>'+nl2br(p.prompt||"请用零基础能看懂的方式解释这个工具，并给出可执行步骤。")+'</code></div></section>'+
    '<section><h2>新手注意什么？ / Beginner tips</h2><ul class="seo-tips"><li>'+esc(p.tip||"先从小任务开始，逐步增加复杂度。")+'</li><li>重要事实请核对原始来源，不要把 AI 第一版回答直接当作最终事实。</li><li>免费额度、地区限制、模型与界面可能变化，使用前请查看官方页面。</li></ul></section>'+
    relatedSection+
    videoSection+
    '<section class="seo-cta"><div><strong>准备开始了？</strong><span>进入官网完成第一次任务，或者打开本站完整交互教程。</span></div><div class="seo-actions"><a class="seo-primary" href="'+attr(url)+'" target="_blank" rel="noopener noreferrer">打开官方入口 ↗</a><a class="seo-secondary" href="../../tutorials/tool.html?tool='+encodeURIComponent(title)+'">完整图文教程 ↗</a></div></section>'+
    '</article></main><script src="../../i18n.js?v=20261007-1"></script><script src="../../tutorials/tutorial-i18n.js?v=20261007-1"></script><script src="../../icons.js?v=20261004-3"></script><script src="../../tutorials/tutorial-data.js?v=20261004-8"></script><script>window.ASH_TUTORIAL_BASE="../../";window.ASH_TUTORIAL_TOOL_NAME='+'JSON.stringify(title).replace(/</g,"\\u003c")+';</script><script src="../../tutorials/tutorial-runtime.js?v=20261007-1"></script></body></html>';
  const dir=path.join(outRoot,slug);
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,"index.html"),html);
  sitemap.push({loc:canonical,lastmod:BUILD_DATE});
}

const sitemapXml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+
  sitemap.map(x=>'  <url><loc>'+esc(x.loc)+'</loc><lastmod>'+x.lastmod+'</lastmod></url>').join("\n")+
  '\n</urlset>\n';
fs.writeFileSync(path.join(ROOT,"sitemap.xml"),sitemapXml);
console.log(JSON.stringify({tools:tools.length,profiles:Object.keys(profiles).length,staticPages:tools.length,sitemapUrls:sitemap.length},null,2));