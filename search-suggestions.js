(function(){
const input=document.getElementById("search");
const box=document.getElementById("suggestions");
if(!input||!box||typeof tools==="undefined") return;

const groups=[
  [["做图片","图片","画图","海报","设计","抠图","image","photo","poster"],["图片","图片 / 设计","设计 / 图片","图片 / 抠图"]],
  [["做视频","视频","剪辑","字幕","短视频","video","edit"],["视频","视频 / 音频"]],
  [["写文章","写作","作文","邮件","文案","改写","润色","write","writing"],["聊天 / 综合"]],
  [["学习","学习资料","资料","总结","研究","论文","study","learn","research"],["学习 / 研究","搜索 / 研究"]],
  [["编程","代码","开发","debug","coding","code"],["编程"]]
];
function norm(s){return String(s||"").toLowerCase().replace(/[\s_\-]+/g,"").trim()}
const chipBrands={"做图片":["Midjourney","Leonardo AI","Ideogram"],"做视频":["Runway","Kling AI","Pika"],"写文章":["ChatGPT","Claude","Gemini"],"学习资料":["NotebookLM","ChatGPT","Gemini"]};
function chipBrandIcons(q){return (chipBrands[q]||[]).map(name=>{const tool=tools.find(t=>t[0]===name)||[];return window.ASHIcons?ASHIcons.brand(name,tool[5]||""):""}).join("")}
function score(t,q){
  const n=norm(q), title=norm(t[0]), cat=norm(t[2]), desc=norm(t[3]), all=norm(t.join(" "));
  let v=0;
  if(title===n)v+=220; else if(title.includes(n))v+=140;
  if(cat.includes(n))v+=100;
  if(desc.includes(n))v+=80;
  if(all.includes(n))v+=30;
  groups.forEach(g=>{
    if(g[0].some(k=>n.includes(norm(k)))&&g[1].indexOf(t[2])>-1)v+=100;
  });
  return v;
}
function matches(q){
  const n=norm(q);
  if(!n)return [];
  return tools.map(t=>({t,v:score(t,q)})).filter(x=>x.v>0).sort((a,b)=>b.v-a.v).slice(0,6).map(x=>x.t);
}

function draw(){
  const q=input.value||"", list=matches(q);
  if(!q.trim()){
    box.innerHTML=`<div class="suggest-title">不知道怎么搜？试试 / Try asking</div><div class="suggest-chips"><button class="suggest-chip" data-q="做图片"><span class="chip-brands">${chipBrandIcons("做图片")}</span><span>做图片 / Images</span></button><button class="suggest-chip" data-q="做视频"><span class="chip-brands">${chipBrandIcons("做视频")}</span><span>做视频 / Video</span></button><button class="suggest-chip" data-q="写文章"><span class="chip-brands">${chipBrandIcons("写文章")}</span><span>写东西 / Write</span></button><button class="suggest-chip" data-q="学习资料"><span class="chip-brands">${chipBrandIcons("学习资料")}</span><span>学习 / Learn</span></button></div>`;
  }else if(list.length){
    box.innerHTML='<div class="suggest-title">你可能在找 / You may be looking for</div>'+list.map(t=>'<button class="suggest-item" data-name="'+t[0]+'"><span class="suggest-icon">'+(window.ASHIcons?ASHIcons.brand(t[0],t[5]):t[1])+'</span><span><strong>'+t[0]+'</strong><small>'+t[2]+' · '+t[3]+'</small></span><b>›</b></button>').join("");
  }else{
    box.innerHTML='<div class="suggest-empty">没找到完全匹配的工具。试试直接描述需求：<strong>做图片 / 写文章 / 学习 / 视频</strong><br><small>Describe what you want to do instead of remembering a tool name.</small></div>';
  }
  box.querySelectorAll(".suggest-chip").forEach(function(b){b.style.setProperty("display","inline-flex","important");b.style.setProperty("align-items","center","important");b.style.setProperty("justify-content","center","important");b.style.setProperty("box-sizing","border-box","important");b.style.setProperty("height","34px","important");b.style.setProperty("max-height","34px","important");b.style.setProperty("min-width","0","important");b.style.setProperty("min-height","0","important");b.style.setProperty("padding","6px 10px","important");b.style.setProperty("font-family","-apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Microsoft YaHei,sans-serif","important");b.style.setProperty("font-size","13px","important");b.style.setProperty("line-height","18px","important");b.style.setProperty("font-weight","400","important");b.style.setProperty("letter-spacing","normal","important");b.style.setProperty("white-space","nowrap","important");b.style.setProperty("-webkit-text-size-adjust","100%","important");b.style.setProperty("text-size-adjust","100%","important");b.style.setProperty("appearance","none","important");b.style.setProperty("-webkit-appearance","none","important")});
box.hidden=false;
  box.querySelectorAll("[data-q]").forEach(b=>b.onclick=function(){input.value=this.dataset.q;draw();input.focus()});
  box.querySelectorAll("[data-name]").forEach(b=>b.onclick=function(){
    input.value=this.dataset.name;
    box.hidden=true;
    if(typeof render==="function")render();
    setTimeout(function(){
      const cards=document.querySelectorAll(".card");
      for(let i=0;i<cards.length;i++)if(cards[i].getAttribute("data-name")===input.value){cards[i].scrollIntoView({behavior:"smooth",block:"center"});break}
    },30);
  });
}
["input","keyup","change","compositionend","search","paste"].forEach(e=>input.addEventListener(e,draw));
input.addEventListener("focus",draw);
input.addEventListener("blur",function(){setTimeout(function(){box.hidden=true},180)});
draw();
var lastSuggestionValue=input.value||"";
setInterval(function(){var v=input.value||"";if(v!==lastSuggestionValue){lastSuggestionValue=v;draw()}},300);
})();