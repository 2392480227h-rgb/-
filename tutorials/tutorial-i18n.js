(function(){
"use strict";
const UI={
  zh:{
    brand:"AI 新手导航 · AI Starter Hub",back:"返回首页 / Home",langButton:"语言",langTitle:"选择语言",langMenuTitle:"语言选择",
    langZh:"简体中文",langTw:"繁體中文",langEn:"English",
    indexEyebrow:"BEGINNER GUIDES · 图文教程",indexTitle:"不会用 AI？",indexTitle2:"跟着图一步一步来。",
    indexLead:"现在工具库里的每个工具都有对应的新手教程入口。教程采用截图式操作示意、中文说明、第一次任务和免费说明，帮助完全没接触过 AI 的人从“打开”走到“会用。",
    indexSub:"Every listed tool has a beginner guide with visual steps, Chinese instructions, a first task, and access notes.",
    badgeMobile:"适合手机",badgeLanguage:"中文教程",badgeVisual:"图文步骤",badgeBeginner:"新手优先",
    allGuides:"全部教程 / All guides",browse:"按工具分类浏览。点击任意工具，就能进入对应的图文教程。",
    readTipTitle:"阅读提示 / Tip:",readTip:"官网会持续更新界面。这里的视觉图是操作示意，不是第三方产品的官方截图。按钮名称会尽量使用常见的中英文字样；实际页面如果略有不同，请以官网当前界面为准。",
    footer:"教程会随着工具和官网界面变化持续更新。 / Guides evolve as products and interfaces change.",
    count:n=>n+" 个工具",
    detailLoading:"正在加载教程 / Loading guide…",detailNotFound:"找不到这个工具 / Tool not found",detailNotFoundLead:"返回教程目录，选择一个工具开始学习。",
    detailEyebrow:"TOOL-SPECIFIC GUIDE",detailTitleSuffix:"新手图文教程",firstTask:"第一次任务 / First task",
    toc:"本页内容 / On this page",understand:"认识 / Understand",watch:"视频 / Watch",practice:"操作 / Practice",task:"任务 / First task",notes:"注意 / Notes",
    understandTitle:"01｜先认识它是干什么的",understandSpan:"Understand the tool",step1:"第 1 步：打开官方入口",step1En:"Step 1: Open the official site",
    officialIntro:"教程负责“教你怎么开始”，实际服务由",officialIntro2:"官方网站提供。",openOfficial:"打开官网 / Open official site ↗",
    visualNote:"操作示意 / Visual guide: 这是原创的界面示意图，不是官方截图。实际按钮和界面可能不同。",
    practiceTitle:"02｜跟着图做一次",practiceSpan:"Practice with the visual steps",step2:"第 2 步：准备输入",step2En:"Step 2: Prepare your input",
    step2Lead:"。先完成最小任务，不追求一次学会全部功能。",step3:"第 3 步：检查结果并继续",step3En:"Step 3: Review and refine",
    step3Lead:"第一次结果不满意很正常。告诉工具哪里要改、保留什么、删掉什么。",
    step3LeadEn:"It is normal for the first result to need changes. Say what to keep, change, or remove.",
    followupTitle:"万能补充 / Useful follow-ups:",followups:"“再简单一点” · “给我 3 个版本” · “只修改这一部分” · “再检查一次”\n“Make it simpler” · “Give me 3 versions” · “Change only this part” · “Check it again”",
    videoHeading:"教程视频直接播放",videoHeadingEn:"Watch right here",videoLead:"视频已经直接嵌入本教程页面，不需要先跳转到 YouTube 或其他站点。YouTube、Bilibili 等可嵌入视频都会在这里显示原生播放器；只有平台明确禁止第三方嵌入时，才保留来源入口作为备用。",
    videoTag:"本站内嵌 · 点播放器即可播放",videoSearchNote:"按当前工具名称精确搜索入门教程。",videoSearch:"教程搜索",videoOpenSearch:"🔎 打开教程来源 ↗",videoSource:"来源页面 ↗",
    videoFootnote:"提示：播放器就在上方。正常情况下直接点击播放器中的 ▶ 即可观看；若平台限制第三方播放，可使用“来源页面”打开原视频。",
    taskTitle:"03｜直接复制，完成第一次任务",taskSpan:"Your first task",copyPrompt:"复制提示词 / Copy prompt",copied:"已复制 / Copied ✓",englishPrompt:"English prompt / 英文提示词",beginnerRule:"新手原则 / Beginner rule",
    notesTitle:"04｜常见坑 & 免费说明",notesSpan:"Common mistakes & access notes",pitfall:"常见坑 / Common pitfall",currentLabel:"当前标记 / Current label:",
    freeNotice:"免费额度、模型、功能、地区限制和界面都会变化。我们不会把一次性试用包装成“永久免费”，实际使用前请以官方页面为准。",
    freeNoticeEn:"Free quotas, models, features, regional availability, and interfaces can change. Check the official site for current terms.",
    updated:"教程更新时间 / Guide update: 2026-10-03 · UI may change.",try:"现在试试 / Try it ↗",backGuides:"返回教程目录 / Back to guides",
    footerDetail:"AI 新手导航 · Discover → Understand → Learn → Use",footerDetailNote:"本教程用于入门导航，不代表第三方工具的官方说明。",
    loadFail:"教程加载失败 / Guide failed to load",loadFailLead:"请刷新页面后再试。",
    videoFeatured:"精选教程",videoOfficial:"官方视频",videoFallback:"教程视频"
  },
  "zh-TW":{
    brand:"AI 新手導航 · AI Starter Hub",back:"返回首頁 / Home",langButton:"語言",langTitle:"選擇語言",langMenuTitle:"語言選擇",
    langZh:"簡體中文",langTw:"繁體中文",langEn:"English",
    indexEyebrow:"BEGINNER GUIDES · 圖文教學",indexTitle:"不會用 AI？",indexTitle2:"跟著圖一步一步來。",
    indexLead:"現在工具庫裡的每個工具都有對應的新手教學入口。教學採用截圖式操作示意、中文說明、第一次任務和免費說明，幫助完全沒接觸過 AI 的人從「打開」走到「會用」。",
    indexSub:"Every listed tool has a beginner guide with visual steps, Chinese instructions, a first task, and access notes.",
    badgeMobile:"適合手機",badgeLanguage:"中文教學",badgeVisual:"圖文步驟",badgeBeginner:"新手優先",
    allGuides:"全部教學 / All guides",browse:"按工具分類瀏覽。點擊任意工具，就能進入對應的圖文教學。",
    readTipTitle:"閱讀提示 / Tip:",readTip:"官網會持續更新介面。這裡的視覺圖是操作示意，不是第三方產品的官方截圖。按鈕名稱會盡量使用常見的中英文字樣；實際頁面如果略有不同，請以官網目前介面為準。",
    footer:"教學會隨著工具和官網介面變化持續更新。 / Guides evolve as products and interfaces change.",
    count:n=>n+" 個工具",
    detailLoading:"正在載入教學 / Loading guide…",detailNotFound:"找不到這個工具 / Tool not found",detailNotFoundLead:"返回教學目錄，選擇一個工具開始學習。",
    detailEyebrow:"TOOL-SPECIFIC GUIDE",detailTitleSuffix:"新手圖文教學",firstTask:"第一次任務 / First task",
    toc:"本頁內容 / On this page",understand:"認識 / Understand",watch:"影片 / Watch",practice:"操作 / Practice",task:"任務 / First task",notes:"注意 / Notes",
    understandTitle:"01｜先認識它是做什麼的",understandSpan:"Understand the tool",step1:"第 1 步：打開官方入口",step1En:"Step 1: Open the official site",
    officialIntro:"教學負責「教你怎麼開始」，實際服務由",officialIntro2:"官方網站提供。",openOfficial:"開啟官網 / Open official site ↗",
    visualNote:"操作示意 / Visual guide: 這是原創的介面示意圖，不是官方截圖。實際按鈕和介面可能不同。",
    practiceTitle:"02｜跟著圖做一次",practiceSpan:"Practice with the visual steps",step2:"第 2 步：準備輸入",step2En:"Step 2: Prepare your input",
    step2Lead:"。先完成最小任務，不追求一次學會全部功能。",step3:"第 3 步：檢查結果並繼續",step3En:"Step 3: Review and refine",
    step3Lead:"第一次結果不滿意很正常。告訴工具哪裡要改、保留什麼、刪掉什麼。",
    step3LeadEn:"It is normal for the first result to need changes. Say what to keep, change, or remove.",
    followupTitle:"萬用補充 / Useful follow-ups:",followups:"「再簡單一點」 · 「給我 3 個版本」 · 「只修改這一部分」 · 「再檢查一次」\n“Make it simpler” · “Give me 3 versions” · “Change only this part” · “Check it again”",
    videoHeading:"教學影片直接播放",videoHeadingEn:"Watch right here",videoLead:"影片已經直接嵌入本教學頁面，不需要先跳轉到 YouTube 或其他站點。YouTube、Bilibili 等可嵌入影片都會在這裡顯示原生播放器；只有平台明確禁止第三方嵌入時，才保留來源入口作為備用。",
    videoTag:"本站內嵌 · 點播放器即可播放",videoSearchNote:"依目前工具名稱精確搜尋入門教學。",videoSearch:"教學搜尋",videoOpenSearch:"🔎 開啟教學來源 ↗",videoSource:"來源頁面 ↗",
    videoFootnote:"提示：播放器就在上方。正常情況下直接點擊播放器中的 ▶ 即可觀看；若平台限制第三方播放，可使用「來源頁面」開啟原影片。",
    taskTitle:"03｜直接複製，完成第一次任務",taskSpan:"Your first task",copyPrompt:"複製提示詞 / Copy prompt",copied:"已複製 / Copied ✓",englishPrompt:"English prompt / 英文提示詞",beginnerRule:"新手原則 / Beginner rule",
    notesTitle:"04｜常見坑 & 免費說明",notesSpan:"Common mistakes & access notes",pitfall:"常見坑 / Common pitfall",currentLabel:"目前標記 / Current label:",
    freeNotice:"免費額度、模型、功能、地區限制和介面都會變化。我們不會把一次性試用包裝成「永久免費」，實際使用前請以官方頁面為準。",
    freeNoticeEn:"Free quotas, models, features, regional availability, and interfaces can change. Check the official site for current terms.",
    updated:"教學更新時間 / Guide update: 2026-10-03 · UI may change.",try:"現在試試 / Try it ↗",backGuides:"返回教學目錄 / Back to guides",
    footerDetail:"AI 新手導航 · Discover → Understand → Learn → Use",footerDetailNote:"本教學用於入門導航，不代表第三方工具的官方說明。",
    loadFail:"教學載入失敗 / Guide failed to load",loadFailLead:"請重新整理頁面後再試。",
    videoFeatured:"精選教學",videoOfficial:"官方影片",videoFallback:"教學影片"
  },
  en:{
    brand:"AI Starter Hub",back:"Back home",langButton:"Language",langTitle:"Choose language",langMenuTitle:"Language",
    langZh:"Simplified Chinese",langTw:"Traditional Chinese",langEn:"English",
    indexEyebrow:"BEGINNER GUIDES · Visual Tutorials",indexTitle:"New to AI?",indexTitle2:"Follow the steps.",
    indexLead:"Every tool in the directory has a beginner tutorial. These guides use visual steps, clear English instructions, a first task, and access notes to help you go from opening a tool to actually using it.",
    indexSub:"Every listed tool has a beginner guide with visual steps, English instructions, a first task, and access notes.",
    badgeMobile:"Mobile-friendly",badgeLanguage:"English guides",badgeVisual:"Visual steps",badgeBeginner:"Beginner first",
    allGuides:"All guides",browse:"Browse tutorials by tool. Open any tool to see its beginner guide.",
    readTipTitle:"Reading tip",readTip:"Product interfaces change over time. The visuals here are original interface mockups, not official screenshots. Button names use common wording where possible; when a real interface differs, follow the current official site.",
    footer:"Guides evolve as products and interfaces change.",
    count:n=>n+" tools",
    detailLoading:"Loading guide…",detailNotFound:"Tool not found",detailNotFoundLead:"Go back to the guide directory and choose a tool.",
    detailEyebrow:"TOOL-SPECIFIC GUIDE",detailTitleSuffix:"Beginner Guide",firstTask:"First task",
    toc:"On this page",understand:"Understand",watch:"Watch",practice:"Practice",task:"First task",notes:"Notes",
    understandTitle:"01 | Understand what it does",understandSpan:"Understand the tool",step1:"Step 1: Open the official site",step1En:"",
    officialIntro:"This guide shows you how to start. The actual service is provided by",officialIntro2:"official site.",openOfficial:"Open official site ↗",
    visualNote:"Visual guide: This is an original interface mockup, not an official screenshot. Actual buttons and screens may differ.",
    practiceTitle:"02 | Practice with the visual steps",practiceSpan:"Practice with the visual steps",step2:"Step 2: Prepare your input",step2En:"",
    step2Lead:" Start with the smallest useful task instead of learning every feature at once.",step3:"Step 3: Review and refine",step3En:"",
    step3Lead:"It is normal for the first result to need changes. Tell the tool what to keep, change, or remove.",
    step3LeadEn:"",
    followupTitle:"Useful follow-ups:",followups:"“Make it simpler” · “Give me 3 versions” · “Change only this part” · “Check it again”",
    videoHeading:"Watch tutorials here",videoHeadingEn:"Watch right here",videoLead:"Videos are embedded directly in this guide. You do not need to leave for YouTube or another site. When a platform blocks third-party embeds, the original source link remains available as a fallback.",
    videoTag:"Embedded here · press play",videoSearchNote:"Search beginner tutorials for the current tool.",videoSearch:"Tutorial search",videoOpenSearch:"Open tutorial source ↗",videoSource:"Source page ↗",
    videoFootnote:"Tip: the player is above. Normally, press ▶ to watch. If a platform blocks embedding, use the source page link.",
    taskTitle:"03 | Copy it and complete your first task",taskSpan:"Your first task",copyPrompt:"Copy prompt",copied:"Copied ✓",englishPrompt:"Prompt",beginnerRule:"Beginner rule",
    notesTitle:"04 | Common mistakes & access notes",notesSpan:"Common mistakes & access notes",pitfall:"Common pitfall",currentLabel:"Current label:",
    freeNotice:"Free quotas, models, features, regional availability, and interfaces can change. We do not present a one-time trial as “free forever.” Check the official site before use.",
    freeNoticeEn:"Check the official site for current terms.",updated:"Guide update: 2026-10-03 · UI may change.",try:"Try it ↗",backGuides:"Back to guides",
    footerDetail:"AI Starter Hub · Discover → Understand → Learn → Use",footerDetailNote:"This guide is for onboarding and discovery, not an official product manual.",
    loadFail:"Guide failed to load",loadFailLead:"Please refresh the page and try again.",
    videoFeatured:"Featured tutorial",videoOfficial:"Official video",videoFallback:"Tutorial video"
  }
};

const CATEGORY_EN={
  "聊天 / 综合":"Chat / General","搜索 / 研究":"Search / Research","学习 / 研究":"Learning / Research","聊天 / 办公":"Chat / Productivity",
  "编程":"Coding","模型 / 开源":"Models / Open Source","本地 AI":"Local AI","图片":"Images","图片 / 设计":"Images / Design","设计 / 图片":"Design / Images",
  "设计":"Design","图片 / 抠图":"Image Background Removal","视频":"Video","音频 / 配音":"Audio / Voice","音乐":"Music","演示 / 文档":"Presentations / Docs",
  "图表 / 文档":"Charts / Docs","视频 / 音频":"Video / Audio","开发 / 模型":"Development / Models","写作 / 办公":"Writing / Productivity","翻译":"Translation",
  "视频 / 数字人":"Video / Avatars","会议 / 音频":"Meetings / Audio","编程 / 搜索":"Coding / Search","聊天 / 助手":"Chat / Assistants","编程 / 开发":"Coding / Development"
};
const STATUS_EN={"免费入口":"Free access","免费额度":"Free tier","免费 / 开源":"Free / open source","免费 / 本地":"Free / local","免费试用":"Free trial","免费使用":"Free to use","付费为主":"Mostly paid","按量计费":"Pay-as-you-go"};

function lang(){return window.ASHI18n?.current?.()||"zh";}
function t(key,...args){const v=UI[lang()]?.[key]??UI.zh[key]??key;return typeof v==="function"?v(...args):v;}
function traditional(value){return String(value??"").replace(/[\u3400-\u9fff]/g,ch=>window.ASHI18n?.toTraditional?window.ASHI18n.toTraditional(ch):ch);}
function category(value){
  const raw=String(value||"其他");
  if(lang()==="en")return CATEGORY_EN[raw]||raw;
  if(lang()==="zh-TW")return window.ASHI18n?.toTraditional?window.ASHI18n.toTraditional(raw):raw;
  return raw;
}
function status(value){
  if(lang()==="en")return STATUS_EN[value]||value;
  if(lang()==="zh-TW")return window.ASHI18n?.toTraditional?window.ASHI18n.toTraditional(value):value;
  return value;
}
function toolName(tool){return window.ASHI18n?.toolName?window.ASHI18n.toolName(tool):Array.isArray(tool)?tool[0]:"";}
function toolDescription(tool){return window.ASHI18n?.toolDescription?window.ASHI18n.toolDescription(tool):Array.isArray(tool)?tool[3]:"";}
function videoSourceType(value){
  if(lang()==="en"){if(value==="官方视频"||value==="官方影片")return t("videoOfficial");if(value==="精选教程"||value==="精選教學")return t("videoFeatured");return value||t("videoFallback");}
  if(lang()==="zh-TW")return traditional(value||t("videoFallback"));
  return value||t("videoFallback");
}
function setPageLanguageMeta(title,description){
  document.documentElement.lang=lang()==="en"?"en":(lang()==="zh-TW"?"zh-TW":"zh-CN");
  document.title=title;
  const meta=document.querySelector('meta[name="description"]');if(meta)meta.content=description;
  const og=document.querySelector('meta[property="og:title"]');if(og)og.setAttribute("content",title);
  const ogd=document.querySelector('meta[property="og:description"]');if(ogd)ogd.setAttribute("content",description);
}
function bindPicker(onChange){
  const btn=document.getElementById("pageLanguageButton"),menu=document.getElementById("pageLanguageMenu");
  if(!btn||!menu)return;
  const label=document.getElementById("pageLanguageLabel");if(label)label.textContent=t("langButton");
  btn.title=t("langTitle");btn.setAttribute("aria-label",t("langTitle"));menu.setAttribute("aria-label",t("langMenuTitle"));
  const labels={zh:t("langZh"),"zh-TW":t("langTw"),en:t("langEn")};
  menu.querySelectorAll("[data-language]").forEach(item=>{
    const key=item.dataset.language,tail=item.querySelector("span");
    if(item.firstChild)item.firstChild.nodeValue=labels[key]||key;
    if(tail)tail.textContent=key==="zh"?"简中":(key==="zh-TW"?"繁中":"EN");
    item.setAttribute("aria-checked",String(key===lang()));item.classList.toggle("is-selected",key===lang());
    if(!item.dataset.bound){item.dataset.bound="1";item.addEventListener("click",()=>{menu.hidden=true;btn.setAttribute("aria-expanded","false");window.ASHI18n?.set(key);});}
  });
  if(!btn.dataset.bound){
    btn.dataset.bound="1";
    const close=()=>{menu.hidden=true;btn.setAttribute("aria-expanded","false");};
    btn.addEventListener("click",e=>{e.stopPropagation();menu.hidden=!menu.hidden;btn.setAttribute("aria-expanded",String(!menu.hidden));});
    menu.addEventListener("click",e=>e.stopPropagation());
    document.addEventListener("click",close);
    document.addEventListener("keydown",e=>{if(e.key==="Escape")close();});
  }
  onChange?.();
}
function bindSync(onChange){
  if(!window.ASHI18n)return;
  if(!window.__ashTutorialSyncBound){
    window.__ashTutorialSyncBound=true;
    window.addEventListener("ash:language-changed",()=>onChange?.());
    window.addEventListener("storage",e=>{if(e.key==="ash-language"&&e.newValue)window.ASHI18n.set(e.newValue);});
  }
}
window.ASHTutorialI18n={t,lang,category,status,toolName,toolDescription,videoSourceType,setPageLanguageMeta,bindPicker,bindSync};
})();