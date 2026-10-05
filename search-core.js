(function(){
"use strict";
const config=window.ASHSearchConfig;
if(!config)return;
const norm=s=>String(s||"").normalize("NFKC").toLowerCase().replace(/[“”‘’]/g,"").replace(/[！-～]/g," ").replace(/[^\\p{L}\\p{N}]+/gu," ").replace(/\\s+/g," ").trim();
const compact=s=>norm(s).replace(/\\s+/g,"");
const uniq=a=>[...new Set(a.filter(Boolean))];
function matchPhrases(raw,phrases){
  const n=compact(raw),out=[];
  for(const p of phrases){const np=compact(p);if(np&&n.includes(np))out.push(np);}
  return uniq(out);
}
function escapeRe(s){return String(s).replace(/[.*+?^$()|[\\]\\]/g,"\\$&");}
function cleanQuery(raw){
  let q=String(raw||"");
  for(const phrase of [...config.stopPhrases].sort((a,b)=>b.length-a.length)){
    q=q.replace(new RegExp(escapeRe(phrase),"giu")," ");
  }
  return norm(q);
}
function context(raw){
  const input=String(raw||"").trim();
  const c=compact(input);
  if(!c)return {query:input,intents:[],tasks:[],terms:[],cleaned:"",intent:null,task:null};
  const intents=config.intents.map(rule=>{
    const hits=matchPhrases(input,rule.phrases);
    return {rule,hits,score:hits.reduce((n,x)=>n+Math.min(90,Math.max(12,x.length*2)),0)+(hits.length?rule.categories.length*4:0)};
  }).filter(x=>x.hits.length).sort((a,b)=>b.score-a.score);
  const tasks=config.tasks.map(rule=>{
    const hits=matchPhrases(input,rule.phrases);
    return {rule,hits,score:hits.reduce((n,x)=>n+Math.min(100,Math.max(14,x.length*3)),0)};
  }).filter(x=>x.hits.length).sort((a,b)=>b.score-a.score);
  const cleaned=cleanQuery(input);
  const terms=uniq([...intents.flatMap(x=>x.hits),...tasks.flatMap(x=>x.hits),...cleaned.split(" ").filter(x=>x.length>=2)]);
  return {query:input,cleaned,intents:intents.slice(0,3),tasks:tasks.slice(0,4),terms,intent:intents[0]?.rule.id||tasks[0]?.rule.intent||null,task:tasks[0]?.rule.id||null};
}
function categoryOf(tool){return window.ASHCategories?.main(tool)||((Array.isArray(tool)?tool[2]:tool)||"");}
function toolName(tool){return Array.isArray(tool)?String(tool[0]||""):String(tool?.name||"");}
function toolText(tool){return Array.isArray(tool)?tool.join(" "):JSON.stringify(tool);}
function metaFor(tool){return config.toolMeta[toolName(tool)]||{};}
function editDistance(a,b){
  a=compact(a);b=compact(b);if(!a||!b)return Math.max(a.length,b.length);if(Math.abs(a.length-b.length)>3)return 99;
  let prev=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++){const cur=[i];for(let j=1;j<=b.length;j++)cur[j]=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=cur;}
  return prev[b.length];
}
function fuzzyScore(term,target){
  const a=compact(term),b=compact(target);if(a.length<2||b.length<2)return 0;if(a===b)return 1;
  if(a.includes(b)||b.includes(a))return Math.min(a.length,b.length)>=3?.75:0;
  if(a.length<=8&&b.length<=12){const d=editDistance(a,b),max=Math.max(a.length,b.length);if(d<=2)return Math.max(0,1-d/max)*.55;}
  return 0;
}
function toolScore(tool,ctx){
  const name=toolName(tool),text=norm(toolText(tool)),cat=norm(categoryOf(tool)),meta=metaFor(tool);let score=0;const nameN=compact(name);
  if(ctx.cleaned&&nameN===compact(ctx.cleaned))score+=1000;
  if(ctx.cleaned&&nameN.includes(compact(ctx.cleaned)))score+=420;
  for(const task of ctx.tasks){if((meta.tasks||[]).includes(task.rule.id))score+=320;if((meta.intents||[]).includes(task.rule.intent))score+=140;}
  for(const intent of ctx.intents){if((meta.intents||[]).includes(intent.rule.id))score+=230;if(intent.rule.categories.some(c=>cat.includes(norm(c))))score+=90;}
  for(const term of ctx.terms){
    if((meta.keywords||[]).some(k=>compact(k)===compact(term)))score+=130;
    if(text.includes(compact(term)))score+=38;
    const fuzzy=Math.max(0,...(meta.keywords||[]).map(k=>fuzzyScore(term,k)),fuzzyScore(term,name));if(fuzzy>0)score+=Math.round(fuzzy*32);
  }
  for(const phrase of [...(meta.keywords||[]),...ctx.terms]){const np=compact(phrase);if(np&&compact(ctx.query).includes(np))score+=12;}
  if(ctx.intent){const rule=config.intents.find(x=>x.id===ctx.intent);if(rule?.categories.some(c=>cat.includes(norm(c))))score+=85;}
  return score;
}
function search(raw,options={}){
  const list=Array.isArray(options.tools)?options.tools:[];const ctx=context(raw);
  let scored=list.map(tool=>({tool,score:toolScore(tool,ctx)}));
  if(options.category&&options.category!=="全部")scored=scored.filter(x=>categoryOf(x.tool)===options.category);
  scored=scored.filter(x=>!ctx.query||x.score>0);
  scored.sort((a,b)=>b.score-a.score||toolName(a.tool).localeCompare(toolName(b.tool)));
  return {context:ctx,results:scored.slice(0,Number.isFinite(options.limit)?options.limit:50)};
}
window.SearchCore={context,search,normalize:norm};
})();