const tools=[
["ChatGPT","💬","聊天 / 综合","通用 AI 助手，可聊天、搜索、分析文件与生成图片。","免费入口","https://chatgpt.com/","OpenAI"],
["Gemini","✨","聊天 / 综合","Google 的多模态 AI 助手，适合搜索、写作与图片理解。","免费入口","https://gemini.google.com/","Google"],
["Claude","🧠","聊天 / 综合","长文本、写作、分析和编程都很强的通用助手。","免费入口","https://claude.ai/","Anthropic"],
["Perplexity","🔎","搜索 / 研究","AI 搜索与研究工具，适合快速找资料和来源。","免费入口","https://www.perplexity.ai/","Perplexity"],
["NotebookLM","📚","学习 / 研究","把自己的资料交给 AI 做总结、问答和研究。","免费入口","https://notebooklm.google.com/","Google"],
["Microsoft Copilot","🪟","聊天 / 办公","微软 AI 助手，提供免费聊天与生产力功能。","免费入口","https://copilot.microsoft.com/","Microsoft"],
["GitHub Copilot","⌨️","编程","AI 编程助手，Free 计划提供有限额度。","免费额度","https://github.com/features/copilot","GitHub"],
["Gemini Code Assist","👨‍💻","编程","Google 的 AI 编程助手，适合 IDE 开发与代码辅助。","免费入口","https://developers.google.com/gemini-code-assist","Google"],
["Cursor","⚡","编程","AI-first 代码编辑器，提供免费使用额度。","免费额度","https://cursor.com/","Cursor"],
["Hugging Face","🤗","模型 / 开源","开源模型、数据集、Spaces 与 AI 社区的大仓库。","免费 / 开源","https://huggingface.co/","Hugging Face"],
["Ollama","🦙","本地 AI","本地运行开源大模型，适合不想把数据交出去的人。","免费 / 开源","https://ollama.com/","Ollama"],
["LM Studio","🖥️","本地 AI","桌面端本地运行和管理大模型。","免费 / 本地","https://lmstudio.ai/","LM Studio"],
["Leonardo AI","🎨","图片","AI 图片生成与创作工具，有免费额度。","免费额度","https://leonardo.ai/","Leonardo"],
["Ideogram","🖼️","图片","擅长海报、文字排版和创意图像生成。","免费额度","https://ideogram.ai/","Ideogram"],
["Adobe Firefly","🔥","图片 / 设计","Adobe 的生成式 AI 工具，提供免费生成额度。","免费额度","https://firefly.adobe.com/","Adobe"],
["Canva","🪄","设计 / 图片","在线设计平台，集成多种 AI 创作功能。","免费入口","https://www.canva.com/ai/","Canva"],
["Microsoft Designer","🎨","设计","用 AI 快速制作图片、海报和社交媒体素材。","免费入口","https://designer.microsoft.com/","Microsoft"],
["PhotoRoom","📸","图片 / 抠图","AI 商品图、背景移除和图片处理。","免费入口","https://www.photoroom.com/","PhotoRoom"],
["CapCut","✂️","视频","AI 视频生成、剪辑、字幕和创作工具。","免费入口","https://www.capcut.com/","CapCut"],
["Pika","🎬","视频","短视频生成与创意特效工具，提供免费入口。","免费额度","https://pika.art/","Pika"],
["Runway","🎞️","视频","专业生成式视频工作流，提供免费试用额度。","免费试用","https://runwayml.com/","Runway"],
["Kling AI","🚀","视频","文本/图片生成视频与运动控制工具。","免费额度","https://klingai.com/","Kuaishou"],
["Luma Dream Machine","🌌","视频","偏电影感的视频生成与图像动画工具。","免费入口","https://lumalabs.ai/dream-machine","Luma"],
["Hailuo AI","🎥","视频","AI 视频生成工具，适合短视频与视觉实验。","免费入口","https://hailuoai.video/","MiniMax"],
["ElevenLabs","🎙️","音频 / 配音","AI 语音、配音和音频生成平台。","免费额度","https://elevenlabs.io/","ElevenLabs"],
["Suno","🎵","音乐","用文字生成歌曲和音乐作品。","免费额度","https://suno.com/","Suno"],
["Udio","🎶","音乐","AI 音乐生成与歌曲创作平台。","免费额度","https://udio.com/","Udio"],
["Gamma","📊","演示 / 文档","AI 生成演示文稿、文档和网页。","免费入口","https://gamma.app/","Gamma"],
["Napkin AI","📝","图表 / 文档","把文字内容快速转换成图表和视觉表达。","免费入口","https://www.napkin.ai/","Napkin"],
["Descript","🎤","视频 / 音频","文字驱动的视频和播客编辑工具，含 AI 功能。","免费入口","https://www.descript.com/","Descript"]
];
const cats=["全部",...new Set(tools.map(x=>x[2]))];let active="全部";
const $=s=>document.querySelector(s);
function renderCats(){ $("#cats").innerHTML=cats.map(c=>`<button class="cat ${c===active?"active":""}" data-c="${c}">${c}</button>`).join("");document.querySelectorAll(".cat").forEach(b=>b.onclick=()=>{active=b.dataset.c;renderCats();render()})}
function esc(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function render(){const q=$("#search").value.trim().toLowerCase();let a=tools.filter(x=>(active==="全部"||x[2]===active)&&(!q||x.join(" ").toLowerCase().includes(q)));if($("#sort").value==="name")a.sort((x,y)=>x[0].localeCompare(y[0]));if($("#sort").value==="free")a.sort((x,y)=>x[4].localeCompare(y[4]));$("#count").textContent=tools.length;$("#summary").textContent=`当前显示 ${a.length} 个`;$("#empty").hidden=a.length>0;$("#grid").innerHTML=a.map(x=>`<article class="card"><div class="top"><span class="icon">${x[1]}</span><span class="badge">${esc(x[4])}</span></div><h2>${esc(x[0])}</h2><div class="desc">${esc(x[3])}</div><div class="meta"><span class="tag">${esc(x[2])}</span><span class="tag">${esc(x[6])}</span></div><a class="open" href="${x[5]}" target="_blank" rel="noopener noreferrer">打开官网 ↗</a></article>`).join("")}
$("#search").oninput=render;$("#sort").onchange=render;renderCats();render();