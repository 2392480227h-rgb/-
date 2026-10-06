(function(){
"use strict";
const input=document.getElementById("search");
const box=document.getElementById("suggestions");
if(!input||!box||typeof tools==="undefined"||!window.SearchCore)return;

function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
const chips=[
  {zh:"做图片",en:"Images",q:"make images"},
  {zh:"做视频",en:"Video",q:"make a video"},
  {zh:"做音乐",en:"Music",q:"make music"},
  {zh:"写文章",en:"Writing",q:"write an article"},
  {zh:"学习资料",en:"Learn",q:"study material"}
];

function chipBrandIcons(q){
  const map={
    "做图片":["Midjourney","Leonardo AI","Ideogram"],
    "做视频":["Runway","Kling AI","Pika"],
    "做音乐":["Suno","Udio","AIVA"],
    "写文章":["ChatGPT","Claude","Gemini"],
    "学习资料":["NotebookLM","ChatGPT","Gemini"]
  };
  return (map[q]||[]).map(name=>{
    const tool=tools.find(t=>t[0]===name)||[];
    return window.ASHIcons?ASHIcons.brand(name,tool[5]||""):"";
  }).join("");
}

function draw(){
  const q=input.value||"";
  const result=window.SearchCore.search(q,{tools,limit:6});
  const ctx=result.context;
  const list=result.results.map(x=>x.tool);

  if(!q.trim()){
    const en=window.ASHI18n?.current()==="en";
    box.innerHTML='<div class="suggest-title">'+esc(window.ASHI18n?.t("suggestTitle")||"不知道怎么搜？试试 / Try asking")+'</div><div class="suggest-chips">'+chips.map(c=>'<button class="suggest-chip" data-q="'+esc(en?c.q:c.zh)+'"><span class="chip-brands">'+chipBrandIcons(c.zh)+'</span><span>'+esc(en?c.en:c.zh)+'</span></button>').join("")+'</div>';
  }else if(list.length){
    const task=ctx.tasks?.[0]?.rule?.intent==="audio"?ctx.tasks?.[0]?.rule?.label:ctx.tasks?.[0]?.rule?.label||"";
    const intent=ctx.intents?.[0]?.rule?.label||"";
    const label=task?(window.ASHI18n?.t("suggestRecognized",window.ASHI18n?.task(task)||task)||("识别到："+task)):(intent?(window.ASHI18n?.t("suggestRecognized",intent)||("识别到："+intent)):(window.ASHI18n?.t("suggestLooking")||"你可能在找 / You may be looking for"));
    box.innerHTML='<div class="suggest-title">'+esc(label)+'</div>'+list.map(tool=>{const name=window.ASHI18n?.toolName(tool)||tool[0];const desc=window.ASHI18n?.toolDescription(tool)||tool[3];const cat=window.ASHI18n?.category(tool)||tool[2];return '<button class="suggest-item" data-name="'+esc(tool[0])+'"><span class="suggest-icon">'+(window.ASHIcons?ASHIcons.brand(tool[0],tool[5]):tool[1])+'</span><span><strong>'+esc(name)+'</strong><small>'+esc(cat)+' · '+esc(desc)+'</small></span><b>›</b></button>';}).join("");
  }else{
    box.innerHTML='<div class="suggest-empty">'+(window.ASHI18n?.t("suggestEmpty")||"暂时没找到合适的工具。换一种说法试试。")+'</div>';
  }

  box.hidden=false;
  box.querySelectorAll("[data-q]").forEach(b=>b.onclick=function(){
    input.value=this.dataset.q;
    draw();
    input.focus();
  });
  box.querySelectorAll("[data-name]").forEach(b=>b.onclick=function(){
    input.value=this.dataset.name;
    box.hidden=true;
    if(typeof render==="function")render({animate:true});
    setTimeout(function(){
      const cards=document.querySelectorAll(".card");
      for(let i=0;i<cards.length;i++){
        if(cards[i].getAttribute("data-name")===input.value){
          cards[i].scrollIntoView({behavior:"smooth",block:"center"});
          break;
        }
      }
    },30);
  });
}

["input","compositionend","search"].forEach(e=>input.addEventListener(e,draw));
input.addEventListener("focus",draw);
input.addEventListener("blur",function(){setTimeout(function(){box.hidden=true},180)});
})();\nwindow.SearchSuggestions={refresh:draw};\n