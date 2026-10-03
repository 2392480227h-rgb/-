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
function renderBeginner(){
  const q=input.value||"", n=norm(q);
  let list=tools.filter(t=>(typeof active==="undefined"||active==="全部"||t[2]===active));
  if(n) list=list.map(t=>({t:t,v:score(t,q)})).filter(x=>x.v>0).sort((a,b)=>b.v-a.v).map(x=>x.t);
  const sort=document.getElementById("sort");
  if(sort&&sort.value==="name")list.sort((a,b)=>a[0].localeCompare(b[0]));
  if(sort&&sort.value==="free")list.sort((a,b)=>a[4].localeCompare(b[4]));
  const grid=document.getElementById("grid"), empty=document.getElementById("empty");
  document.getElementById("count").textContent=tools.length;
  document.getElementById("summary").textContent="当前显示 "+list.length+" 个";
  empty.hidden=list.length>0;
  grid.innerHTML=list.map(t=>'<article class="card" data-name="'+t[0]+'"><div class="top"><span class="icon">'+t[1]+'</span><span class="badge">'+t[4]+'</span></div><h2>'+t[0]+'</h2><div class="desc">'+t[3]+'</div><div class="meta"><span class="tag">'+t[2]+'</span><span class="tag">'+t[6]+'</span></div><a class="open" href="'+t[5]+'" target="_blank" rel="noopener noreferrer">打开官网 ↗</a></article>').join("");
}
window.render=renderBeginner;

function draw(){
  const q=input.value||"", list=matches(q);
  if(!q.trim()){
    box.innerHTML='<div class="suggest-title">不知道怎么搜？试试 / Try asking</div><div class="suggest-chips"><button data-q="做图片">🎨 做图片 / Images</button><button data-q="做视频">🎬 做视频 / Video</button><button data-q="写文章">✍️ 写东西 / Write</button><button data-q="学习资料">📚 学习 / Learn</button></div>';
  }else if(list.length){
    box.innerHTML='<div class="suggest-title">你可能在找 / You may be looking for</div>'+list.map(t=>'<button class="suggest-item" data-name="'+t[0]+'"><span class="suggest-icon">'+t[1]+'</span><span><strong>'+t[0]+'</strong><small>'+t[2]+' · '+t[3]+'</small></span><b>›</b></button>').join("");
  }else{
    box.innerHTML='<div class="suggest-empty">没找到完全匹配的工具。试试直接描述需求：<strong>做图片 / 写文章 / 学习 / 视频</strong><br><small>Describe what you want to do instead of remembering a tool name.</small></div>';
  }
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