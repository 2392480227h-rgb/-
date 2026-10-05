(function(){
"use strict";
const input=document.getElementById("search");
const box=document.getElementById("suggestions");
if(!input||!box||typeof tools==="undefined"||!window.SearchCore)return;

function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
const chips=[
  ["做图片","Images"],["做视频","Video"],["写文章","Writing"],["学习资料","Learn"]
];

function chipBrandIcons(q){
  const map={
    "做图片":["Midjourney","Leonardo AI","Ideogram"],
    "做视频":["Runway","Kling AI","Pika"],
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
    box.innerHTML='<div class="suggest-title">不知道怎么搜？试试 / Try asking</div><div class="suggest-chips">'+chips.map(([a,b])=>'<button class="suggest-chip" data-q="'+a+'"><span class="chip-brands">'+chipBrandIcons(a)+'</span><span>'+a+' / '+b+'</span></button>').join("")+'</div>';
  }else if(list.length){
    const task=ctx.tasks?.[0]?.rule?.label||"";
    const intent=ctx.intents?.[0]?.rule?.label||"";
    const label=task?("识别到："+task):(intent?("识别到："+intent):"你可能在找 / You may be looking for");
    box.innerHTML='<div class="suggest-title">'+esc(label)+'</div>'+list.map(t=>'<button class="suggest-item" data-name="'+esc(t[0])+'"><span class="suggest-icon">'+(window.ASHIcons?ASHIcons.brand(t[0],t[5]):t[1])+'</span><span><strong>'+esc(t[0])+'</strong><small>'+esc(t[2])+' · '+esc(t[3])+'</small></span><b>›</b></button>').join("");
  }else{
    box.innerHTML='<div class="suggest-empty">暂时没找到合适的工具。换一种说法试试，例如：<strong>我想做图片 / 我想用 AI 做视频 / 我想学 Python</strong><br><small>Describe what you want to do instead of remembering a tool name.</small></div>';
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
})();