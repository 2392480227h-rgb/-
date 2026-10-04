const internationalNames={"豆包":"Doubao","通义千问":"Qwen","文心助手":"ERNIE Assistant","腾讯元宝":"Yuanbao","智谱清言":"ChatGLM","秘塔AI搜索":"Metaso","即梦AI":"Jimeng AI","通义灵码":"Qoder CN"};

const mainCategory=(toolOrCategory)=>window.ASHCategories?.main(toolOrCategory)||((Array.isArray(toolOrCategory)?toolOrCategory[2]:toolOrCategory)||"其他");
const taskMap={"聊天":"聊天 / 助手","学习":"搜索 / 研究","写作":"写作 / 办公","图片":"图片 / 设计","视频":"视频 / 音频","编程":"编程 / 开发"};

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
["Descript","🎤","视频 / 音频","文字驱动的视频和播客编辑工具，含 AI 功能。","免费入口","https://www.descript.com/","Descript"],
["DeepSeek","🐋","聊天 / 综合","国产通用 AI 助手，适合问答、推理、写作与代码。","免费使用","https://chat.deepseek.com/","DeepSeek"],
["豆包","🥔","聊天 / 综合","字节跳动 AI 助手，支持聊天、写作、图片、语音等。","免费使用","https://www.doubao.com/","字节跳动"],
["Kimi","🌙","聊天 / 综合","长文档、研究、写作与复杂任务助手。","免费使用","https://www.kimi.com/","Moonshot AI"],
["通义千问","🧠","聊天 / 综合","阿里通义 AI 助手，覆盖问答、写作、学习与多模态。","免费使用","https://www.qianwen.com/","Alibaba"],
["文心助手","🧭","聊天 / 综合","百度 AI 助手，提供问答、写作、搜索与办公能力。","免费使用","https://yiyan.baidu.com/","Baidu"],
["腾讯元宝","🪙","聊天 / 综合","腾讯 AI 助手，适合日常问答、文件处理与内容创作。","免费使用","https://yuanbao.tencent.com/","Tencent"],
["智谱清言","🟣","聊天 / 综合","智谱 AI 对话助手，支持写作、学习和代码等任务。","免费入口","https://chatglm.cn/","Zhipu AI"],
["秘塔AI搜索","🔍","搜索 / 研究","中文 AI 搜索与研究工具，适合查资料和整理信息。","免费使用","https://metaso.cn/","Metaso"],
["Poe","🧩","聊天 / 综合","多模型 AI 聊天平台，可体验不同模型与机器人。","免费额度","https://poe.com/","Quora"],
["HuggingChat","🤗","模型 / 开源","Hugging Face 的开放式 AI 聊天入口，可体验开源模型。","免费使用","https://huggingface.co/chat/","Hugging Face"],
["Mistral Le Chat","🌬️","聊天 / 综合","Mistral 的多功能 AI 助手，支持写作、研究和代码。","免费入口","https://chat.mistral.ai/","Mistral AI"],
["Google AI Studio","🧪","开发 / 模型","直接体验 Gemini 模型并制作 AI 原型。","免费额度","https://aistudio.google.com/","Google"],
["Groq","⚡","开发 / 模型","高速运行多种开源模型的 AI 平台。","免费额度","https://groq.com/","Groq"],
["Grammarly","✏️","写作 / 办公","英文语法、润色、改写和写作辅助工具。","免费入口","https://www.grammarly.com/","Grammarly"],
["QuillBot","🪶","写作 / 办公","英文改写、总结、语法检查和翻译工具。","免费入口","https://quillbot.com/","QuillBot"],
["DeepL","🌐","翻译","高质量文本与文档翻译工具。","免费入口","https://www.deepl.com/","DeepL"],
["Google Translate","🗺️","翻译","支持文字、图片、语音和网页翻译。","免费使用","https://translate.google.com/","Google"],
["即梦AI","🎨","图片","字节跳动即梦 AI，适合图片创作与视觉设计。","免费额度","https://jimeng.jianying.com/","ByteDance"],
["SeaArt AI","🖌️","图片","AI 绘画与模型社区，提供大量创作模型。","免费额度","https://www.seaart.ai/","SeaArt"],
["Tensor.Art","🧰","图片","在线 AI 绘画与模型工作台，支持多种开源模型。","免费额度","https://tensor.art/","Tensor.Art"],
["Mage.space","🧙","图片","在线 AI 图像生成平台，提供免费体验入口。","免费额度","https://www.mage.space/","Mage"],
["Craiyon","🖍️","图片","简单易用的文字生成图片工具。","免费入口","https://www.craiyon.com/","Craiyon"],
["Playground","🛝","图片 / 设计","AI 图像生成与编辑平台，提供免费使用额度。","免费额度","https://playground.com/","Playground"],
["Clipdrop","✂️","图片 / 设计","背景移除、清理、放大和生成等图像工具集合。","免费额度","https://clipdrop.co/","Stability AI"],
["Cleanup.pictures","🧽","图片","用 AI 删除照片中的人物、物体和瑕疵。","免费入口","https://cleanup.pictures/","Cleanup"],
["Remove.bg","🪄","图片 / 抠图","自动移除图片背景，适合证件照和商品图。","免费入口","https://www.remove.bg/","Canva"],
["OpusClip","🎞️","视频","把长视频自动切成适合短视频平台的片段。","免费额度","https://www.opus.pro/","OpusClip"],
["VEED","🎬","视频","在线 AI 视频编辑、字幕、配音和短视频制作。","免费入口","https://www.veed.io/","VEED"],
["InVideo AI","📹","视频","用文字快速生成视频脚本、素材和成片。","免费额度","https://invideo.io/","InVideo"],
["HeyGen","🧑‍💻","视频 / 数字人","AI 数字人、口播视频和多语言视频制作。","免费额度","https://www.heygen.com/","HeyGen"],
["TTSMaker","🔊","音频 / 配音","在线文字转语音工具，支持多语言和多种声音。","免费使用","https://ttsmaker.com/","TTSMaker"],
["PlayHT","🎙️","音频 / 配音","AI 语音生成与配音平台，提供免费体验额度。","免费额度","https://play.ht/","PlayHT"],
["AIVA","🎼","音乐","AI 作曲工具，可生成不同风格的音乐。","免费额度","https://www.aiva.ai/","AIVA"],
["Soundraw","🎹","音乐","AI 音乐生成与背景音乐创作工具。","免费试用","https://soundraw.io/","SOUNDRAW"],
["Tome","📖","演示 / 文档","AI 演示和故事化内容创作工具。","免费额度","https://tome.app/","Tome"],
["Beautiful.ai","✨","演示 / 文档","AI 辅助制作演示文稿和商务幻灯片。","免费试用","https://www.beautiful.ai/","Beautiful.ai"],
["Otter.ai","🦦","会议 / 音频","会议录音、转写、摘要和行动项整理工具。","免费额度","https://otter.ai/","Otter.ai"],
["Fireflies.ai","🔥","会议 / 音频","AI 会议记录、转写、摘要和搜索工具。","免费额度","https://fireflies.ai/","Fireflies.ai"],

["Jan","🖥️","本地 AI","开源桌面 AI 助手，可在本地运行模型。","免费 / 开源","https://jan.ai/","Jan"],
["GPT4All","🧠","本地 AI","桌面端本地运行和聊天的开源 AI 软件。","免费 / 开源","https://www.nomic.ai/gpt4all","Nomic"],
["ComfyUI","🧱","本地 AI","节点式开源生成式 AI 工作流工具。","免费 / 开源","https://www.comfy.org/","Comfy"],
["Fooocus","🖼️","本地 AI","面向新手的开源 Stable Diffusion 图像生成界面。","免费 / 开源","https://github.com/lllyasviel/Fooocus","Open Source"],
["Stable Diffusion","🌊","本地 AI","开放生态的图像生成模型，可本地运行。","免费 / 开源","https://stability.ai/stable-image","Stability AI"],
["CodeGeeX","💻","编程","中文友好的 AI 编程助手和代码生成工具。","免费入口","https://codegeex.cn/","Zhipu AI"],
["通义灵码","🪄","编程","阿里 AI 编程助手，提供 IDE 代码补全和问答。","免费使用","https://tongyi.aliyun.com/lingma","Alibaba"],
["Blackbox AI","🖤","编程","AI 编程助手，支持代码生成、解释与开发辅助。","免费额度","https://www.blackbox.ai/","Blackbox AI"],
["Replit","🧑‍💻","编程","在线编程环境，内置 AI 开发辅助功能。","免费入口","https://replit.com/","Replit"],
["Phind","🔎","编程 / 搜索","面向开发者的 AI 搜索与编程助手。","免费入口","https://www.phind.com/","Phind"],
["Symbolab","🧮","学习 / 研究","数学题求解与步骤讲解工具，适合学习。","免费入口","https://www.symbolab.com/","Symbolab"],
["Grok","🤖","聊天 / 助手","xAI 的通用 AI 助手，适合问答、研究、图片理解与创作。","免费入口","https://grok.com/","xAI"],
["Meta AI","🦙","聊天 / 助手","Meta 的 AI 助手，适合日常问答、研究、写作和图片创作。","免费入口","https://www.meta.ai/","Meta"],
["Character.AI","🎭","聊天 / 助手","角色对话与创作平台，适合体验不同 AI 人物和故事场景。","免费入口","https://character.ai/","Character Technologies"],
["Pi","💬","聊天 / 助手","偏自然对话和陪伴式交流的 AI 助手。","免费入口","https://pi.ai/","Inflection AI"],
["You.com","🔍","聊天 / 助手","多模型 AI 助手与搜索平台，可用于问答、研究和写作。","免费入口","https://you.com/","You.com"],
["Manus","🧑‍💻","聊天 / 助手","面向复杂任务的 AI Agent 平台，可规划并执行多步骤工作。","免费额度","https://manus.im/","Manus"],
["Replika","🫂","聊天 / 助手","AI 陪伴式对话应用，适合轻量聊天与长期互动。","免费入口","https://replika.com/","Replika"],
["Monica","🪄","聊天 / 助手","多模型 AI 助手，可用于聊天、写作、翻译和网页辅助。","免费额度","https://monica.im/","Monica"],
["Consensus","📚","搜索 / 研究","面向学术研究的 AI 搜索工具，帮助从论文中快速提炼结论。","免费入口","https://consensus.app/","Consensus"],
["Elicit","🔬","搜索 / 研究","AI 研究助手，适合发现论文、总结研究并整理证据。","免费入口","https://elicit.com/","Elicit"],
["scite","🧪","搜索 / 研究","学术检索与引用分析工具，可查看研究结论是否获得后续文献支持。","免费试用","https://scite.ai/","Research Solutions"],
["Genspark","✨","搜索 / 研究","AI 搜索与研究工作台，适合把检索、总结和任务处理放在一起。","免费入口","https://www.genspark.ai/","Genspark"],
["Felo","🌐","搜索 / 研究","多语言 AI 搜索工具，支持实时问答、来源引用和研究整理。","免费入口","https://felo.ai/","Felo"],
["Exa","🧭","搜索 / 研究","面向 AI 应用的语义搜索与网页检索平台。","免费额度","https://exa.ai/","Exa"],
["Tavily","🕸️","搜索 / 研究","为 AI Agent 提供网页搜索、内容提取与研究能力的开发者平台。","免费额度","https://tavily.com/","Tavily"],
["WolframAlpha","∑","搜索 / 研究","计算知识引擎，适合数学、科学、单位换算和数据问题。","免费入口","https://www.wolframalpha.com/","Wolfram Research"],
["Brave Search","🦁","搜索 / 研究","隐私友好的搜索引擎，包含 AI 辅助答案和来源信息。","免费使用","https://search.brave.com/","Brave"],
["Notion AI","📝","写作 / 办公","在 Notion 工作空间中进行写作、总结、整理和知识问答。","免费额度","https://www.notion.com/product/ai","Notion"],
["Jasper","✍️","写作 / 办公","面向营销和内容团队的 AI 写作与品牌内容平台。","免费试用","https://www.jasper.ai/","Jasper"],
["Copy.ai","📣","写作 / 办公","AI 内容与工作流工具，适合营销文案、销售和重复性文字工作。","免费入口","https://www.copy.ai/","Copy.ai"],
["Writesonic","🖊️","写作 / 办公","AI 写作与内容平台，覆盖文章、SEO 和营销内容。","免费额度","https://writesonic.com/","Writesonic"],
["Rytr","🪶","写作 / 办公","轻量 AI 写作助手，适合短文、邮件、营销文案和改写。","免费额度","https://rytr.me/","Rytr"],
["Wordtune","🔧","写作 / 办公","英文改写、润色和表达优化工具。","免费额度","https://www.wordtune.com/","AI21 Labs"],
["LanguageTool","✅","写作 / 办公","多语言语法、拼写和风格检查工具，并提供 AI 改写功能。","免费入口","https://languagetool.org/","LanguageTool"],
["Anyword","📈","写作 / 办公","偏营销内容生成和文案优化的 AI 平台。","免费试用","https://www.anyword.com/","Anyword"],
["Sudowrite","📖","写作 / 办公","面向小说和创意写作的 AI 写作助手。","免费试用","https://www.sudowrite.com/","Sudowrite"],
["Midjourney","🌀","图片 / 设计","高质量 AI 图像生成平台，适合概念设计、视觉创作与风格探索。","付费为主","https://www.midjourney.com/","Midjourney"],
["Krea","🎨","图片 / 设计","实时 AI 图像创作与增强平台，适合快速视觉迭代。","免费额度","https://www.krea.ai/","Krea"],
["Recraft","🖌️","图片 / 设计","AI 视觉设计工具，适合图标、海报、矢量和品牌视觉。","免费额度","https://www.recraft.ai/","Recraft"],
["Freepik AI","🧰","图片 / 设计","Freepik 的 AI 创作工具集合，覆盖图片生成、编辑和设计。","免费额度","https://www.freepik.com/ai","Freepik"],
["OpenArt","🖼️","图片 / 设计","AI 图像生成和创作平台，提供多种模型与工作流。","免费额度","https://openart.ai/","OpenArt"],
["Pixlr AI","✂️","图片 / 设计","在线图片编辑与 AI 生成工具，适合快速修图和设计。","免费入口","https://pixlr.com/","Pixlr"],
["getimg.ai","🧠","图片 / 设计","AI 图像生成与编辑平台，提供多种模型和图像工具。","免费额度","https://getimg.ai/","getimg.ai"],
["Magnific AI","🔍","图片 / 设计","AI 图像放大与细节增强工具，适合提升图片清晰度和细节。","免费试用","https://magnific.ai/","Magnific"],
["Dzine","🧩","图片 / 设计","AI 设计与图像编辑平台，适合产品图、风格转换和视觉创作。","免费额度","https://www.dzine.ai/","Dzine"],
["Hedra","🎥","视频 / 音频","AI 视频创作平台，支持文字、图片和角色视频，并可在多模型工作区中制作短视频。","免费入口","https://www.hedra.com/","Hedra"],
["Synthesia","🧑‍🏫","视频 / 音频","AI 数字人视频平台，适合培训、演示和企业内容制作。","免费试用","https://www.synthesia.io/","Synthesia"],
["Captions","💬","视频 / 音频","面向短视频创作者的 AI 视频编辑和字幕工具。","免费额度","https://www.captions.ai/","Captions"],
["Vizard","✂️","视频 / 音频","AI 视频剪辑工具，可把长视频整理成短视频并自动生成字幕。","免费额度","https://vizard.ai/","Vizard"],
["Wisecut","✂️","视频 / 音频","AI 自动剪辑工具，适合口播、课程和长视频快速整理。","免费额度","https://www.wisecut.video/","Wisecut"],
["Vidnoz AI","🧑‍💻","视频 / 音频","AI 数字人和视频生成平台，适合快速制作口播与讲解视频。","免费额度","https://www.vidnoz.com/","Vidnoz"],
["Riverside","🎙️","视频 / 音频","远程录音录像平台，提供 AI 转写、剪辑和内容整理。","免费额度","https://riverside.fm/","Riverside"],
["Krisp","🎧","视频 / 音频","AI 降噪和通话增强工具，适合会议、录音和在线沟通。","免费入口","https://krisp.ai/","Krisp"],
["Adobe Podcast","🎙️","视频 / 音频","Adobe 的在线音频工具，提供语音增强、转录和播客工作流。","免费入口","https://podcast.adobe.com/","Adobe"],
["Windsurf","🌊","编程 / 开发","AI-first 开发环境，支持代码补全、Agent 和项目级协作。","免费额度","https://windsurf.com/","Windsurf"],
["Bolt.new","⚡","编程 / 开发","浏览器里的 AI 全栈开发工具，可从自然语言快速生成 Web 应用。","免费额度","https://bolt.new/","StackBlitz"],
["Lovable","💜","编程 / 开发","用自然语言快速构建 Web 应用和原型的 AI 开发平台。","免费额度","https://lovable.dev/","Lovable"],
["v0","🟣","编程 / 开发","Vercel 的 AI 界面与应用生成工具，适合快速制作 Web UI。","免费额度","https://v0.dev/","Vercel"],
["Amazon Q Developer","☁️","编程 / 开发","AWS 面向开发者的 AI 助手，支持代码、调试和 AWS 工作流。","免费入口","https://aws.amazon.com/q/developer/","Amazon"],
["Tabnine","⌨️","编程 / 开发","AI 代码补全与开发助手，支持多种 IDE 和企业开发环境。","免费入口","https://www.tabnine.com/","Tabnine"],
["Continue","🧩","编程 / 开发","开源 AI 编程助手，可在 IDE 中连接不同模型进行开发。","免费 / 开源","https://www.continue.dev/","Continue"],
["Cline","🤖","编程 / 开发","VS Code 中的开源 AI Coding Agent，可读写项目并执行开发任务。","免费 / 开源","https://cline.bot/","Cline"],
["Roo Code","🦘","编程 / 开发","开源 AI 编程 Agent，支持在编辑器里规划、修改和运行项目任务。","免费 / 开源","https://roocode.com/","Roo Code"],
["OpenHands","👐","编程 / 开发","开源 AI 软件开发 Agent，适合让 AI 在真实代码环境中完成任务。","免费 / 开源","https://openhands.dev/","OpenHands"],
["Devin","🧑‍💻","编程 / 开发","面向软件开发任务的 AI Agent，可处理编码、调试和工程工作流。","付费为主","https://devin.ai/","Cognition"],
["Google Antigravity","🛰️","编程 / 开发","Google 的 Agentic 开发平台，适合让 AI 代理参与编码、浏览器操作和多步骤开发任务。","免费入口","https://antigravity.google/","Google"],
["OpenRouter","🛣️","模型 / 开源","统一访问多家模型的 API 与聊天平台，适合比较和切换模型。","免费额度","https://openrouter.ai/","OpenRouter"],
["Replicate","🧬","模型 / 开源","云端运行和部署开源模型的开发者平台。","按量计费","https://replicate.com/","Replicate"],
["Together AI","🤝","模型 / 开源","提供开源模型推理和 AI 应用开发能力的云平台。","免费额度","https://www.together.ai/","Together AI"],
["Fireworks AI","🎆","模型 / 开源","面向开发者的模型推理与 AI 应用平台，支持多种开放模型。","免费额度","https://fireworks.ai/","Fireworks AI"],
["Cerebras","🧠","模型 / 开源","提供高速 AI 推理与模型服务的开发者平台。","免费额度","https://www.cerebras.ai/","Cerebras"],
["ModelScope","🧪","模型 / 开源","阿里开源模型与数据资源社区，提供模型、数据集和在线体验。","免费 / 开源","https://modelscope.cn/","Alibaba"],
["Kaggle Models","📦","模型 / 开源","Kaggle 的模型与数据科学社区，适合发现、测试和学习开源模型。","免费 / 开源","https://www.kaggle.com/models","Google"],
["vLLM","⚙️","模型 / 开源","高性能开源 LLM 推理与服务框架，适合部署大模型 API。","免费 / 开源","https://vllm.ai/","vLLM"],
["llama.cpp","🦙","模型 / 开源","轻量开源项目，可在本地高效运行多种量化大语言模型。","免费 / 开源","https://github.com/ggml-org/llama.cpp","ggml-org"],
["AnythingLLM","📚","本地 AI","开源本地 AI 工作区，可把文档、模型和聊天放在一个环境中。","免费 / 开源","https://anythingllm.com/","Mintplex Labs"],
["Open WebUI","🖥️","本地 AI","开源 AI Web 界面，可连接 Ollama 与其他模型服务。","免费 / 开源","https://openwebui.com/","Open WebUI"],
["LocalAI","🏠","本地 AI","开源本地 AI 推理服务，可在本机运行多种模型并提供兼容 API。","免费 / 开源","https://localai.io/","LocalAI"],
["KoboldCpp","🐉","本地 AI","面向本地运行大语言模型的轻量工具，适合低门槛体验本地 AI。","免费 / 开源","https://github.com/LostRuins/koboldcpp","LostRuins"],
["Msty","🧪","本地 AI","桌面端本地 AI 工作区，方便管理模型、文档和对话。","免费入口","https://msty.app/","Msty"],
["Pinokio","📦","本地 AI","本地 AI 应用启动器，可安装和管理多种开源 AI 工具。","免费 / 开源","https://pinokio.computer/","Pinokio"]
];
const cats=["全部",...(window.ASHCategories?.list||[])];let active="全部";
const $=s=>document.querySelector(s);
const reducedMotion=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches===true;
let initialRender=true;
let renderMotionTimer=0;
function renderCats(){ $("#cats").innerHTML=cats.map(c=>`<button class="cat ${c===active?"active":""}" data-c="${c}">${c}</button>`).join("");document.querySelectorAll(".cat").forEach(b=>b.onclick=()=>{active=b.dataset.c;render({animate:true})})}
function esc(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function normalize(s){return String(s||"").toLowerCase().replace(/[\s_\-]+/g,"").trim()}
function toolSlug(name){
  const seed=internationalNames[name]||name;
  let slug=String(seed).toLowerCase().replace(/&/g," and ").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
  if(!slug){let h=2166136261;for(const ch of String(name))h=Math.imul(h^ch.charCodeAt(0),16777619);slug="tool-"+(h>>>0).toString(36)}
  return slug;
}
const HOT_RANK=["ChatGPT","Gemini","Claude","Perplexity","DeepSeek","Grok","Kimi","NotebookLM","Cursor","GitHub Copilot","Midjourney","Canva","Runway","Suno","ElevenLabs","CapCut","Google AI Studio","Hugging Face","Manus","Genspark","通义千问","Kling AI","Gamma","HeyGen","Replit"];
function heatScore(name){
  let hash=2166136261;
  for(let i=0;i<name.length;i++) hash=Math.imul(hash^name.charCodeAt(i),16777619);
  const rank=HOT_RANK.indexOf(name);
  if(rank>=0) return 1010-rank*25+((hash>>>0)%11);
  return 360+((hash>>>0)%331);
}
function heatRank(name){
  const rank=HOT_RANK.indexOf(name);
  return rank>=0 ? rank+1 : 0;
}
function getToolId(tool){return window.ASHToolId?.fromUrl(tool?.[5])||""}
function syncFavoriteButton(button){
  const toolId=decodeURIComponent(button.dataset.favoriteToolId||"");
  const active=window.ASHFavorites?.has(toolId)===true;
  const name=button.dataset.favoriteToolName ? decodeURIComponent(button.dataset.favoriteToolName) : "";
  button.classList.toggle("is-favorite",active);
  button.setAttribute("aria-pressed",String(active));
  button.setAttribute("title",active?("取消收藏 "+name):("收藏 "+name));
  button.setAttribute("aria-label",active?("取消收藏 "+name):("收藏 "+name));
  const star=button.querySelector(".favorite-star");
  if(star)star.textContent=active?"★":"☆";
  const label=button.querySelector(".favorite-label");
  if(label)label.textContent=active?"已收藏":"收藏";
}
function bindRecentLinks(){
  document.querySelectorAll(".open").forEach(link=>{
    link.addEventListener("click",()=>{
      const article=link.closest(".card");
      const name=article?.dataset.name||"";
      const tool=tools.find(item=>item[0]===name);
      if(tool&&window.ASHRecent)window.ASHRecent.add({toolId:getToolId(tool),name:tool[0],url:tool[5],category:tool[2],company:tool[6],icon:tool[1]});
    });
  });
}
function bindFavoriteButtons(){
  document.querySelectorAll(".favorite-button").forEach(button=>{
    syncFavoriteButton(button);
    button.onclick=event=>{
      event.preventDefault();
      event.stopPropagation();
      const toolId=decodeURIComponent(button.dataset.favoriteToolId||"");
      const tool=tools.find(item=>getToolId(item)===toolId);
      if(!tool||!window.ASHFavorites)return;
      window.ASHFavorites.toggle({toolId:getToolId(tool),name:tool[0],url:tool[5],category:tool[2],company:tool[6],icon:tool[1]});
      syncFavoriteButton(button);
      if(!reducedMotion){
        button.classList.remove("is-bouncing");
        requestAnimationFrame(()=>button.classList.add("is-bouncing"));
        window.setTimeout(()=>button.classList.remove("is-bouncing"),320);
      }
    };
  });
}
function render({animate=false}={}){
  const input=$("#search"), q=normalize(input.value);
  let a=tools.filter(x=>(active==="全部"||mainCategory(x)===active)&&(!q||normalize(x.join(" ")+" "+(internationalNames[x[0]]||"")).includes(q)));
  const sort=$("#sort").value;
  const favoriteIds=new Set((window.ASHFavorites?.getAll?.()||[]).map(item=>item.toolId));
  if(sort==="heat") a.sort((x,y)=>heatScore(y[0])-heatScore(x[0]));
  if(sort==="favorites") a.sort((x,y)=>(favoriteIds.has(getToolId(y))?1:0)-(favoriteIds.has(getToolId(x))?1:0)||heatScore(y[0])-heatScore(x[0]));
  if(sort==="name") a.sort((x,y)=>x[0].localeCompare(y[0]));
  if(sort==="free") a.sort((x,y)=>x[4].localeCompare(y[4])||heatScore(y[0])-heatScore(x[0]));
  $("#count").textContent=tools.length;
  $("#summary").textContent=`当前显示 ${a.length} 个`;
  $("#empty").hidden=a.length>0;
  const grid=$("#grid");
  if(animate&&!reducedMotion) grid.classList.add("is-updating");
  grid.innerHTML=a.map(x=>{
    const score=heatScore(x[0]), rank=heatRank(x[0]), hot=rank>0&&rank<=10;
    return `<article class="card" data-name="${esc(x[0])}" data-heat="${score}">
      <div class="top"><span class="icon">${ASHIcons.brand(x[0],x[5])}</span>
        <div class="card-top-actions">
          <span class="badge">${esc(x[4])}</span>
          <div class="favorite-wrap">
            <button class="favorite-button" type="button" data-favorite-tool-id="${encodeURIComponent(getToolId(x))}" data-favorite-tool-name="${encodeURIComponent(x[0])}" aria-pressed="false" title="收藏 ${esc(x[0])}">
              <span class="favorite-star" aria-hidden="true">☆</span><span class="favorite-label">收藏</span>
            </button>
          </div>
        </div>
      </div>
      <h2>${esc(x[0])}${internationalNames[x[0]]?`<small class="intl-name">${esc(internationalNames[x[0]])}</small>`:""}</h2>
      <div class="desc">${esc(x[3])}</div>
      <div class="meta"><span class="tag">${esc(mainCategory(x))}</span><span class="tag">${esc(x[6])}</span></div>
      <div class="card-signal">
        <span class="popularity ${hot?"is-hot":""}">🔥 热度 ${score}${rank?` · TOP ${rank}`:""}</span>
        <span class="signal-note">站内参考指数</span>
      </div>
      <div class="card-actions guide-ready">
        <a class="open" href="${x[5]}" target="_blank" rel="noopener noreferrer">打开官网 ↗</a>
        <a class="learn" href="tools/${toolSlug(x[0])}/"><span class="link-icon">${ASHIcons.svg("book")}</span> 新手教程 / Guide</a>
      </div>
    </article>`;
  }).join("");

  if(initialRender&&!reducedMotion){
    grid.querySelectorAll(".card").forEach((card,index)=>{
      if(index<12){
        card.classList.add("is-entering");
        card.addEventListener("animationend",()=>card.classList.remove("is-entering"),{once:true});
      }
    });
    initialRender=false;
  } else if(animate&&!reducedMotion){
    window.clearTimeout(renderMotionTimer);
    renderMotionTimer=window.setTimeout(()=>grid.classList.remove("is-updating"),90);
  }

  bindFavoriteButtons();bindRecentLinks()
}
function syncSearch(){const v=$("#search").value||"";if(v!==window.__lastSearchValue){window.__lastSearchValue=v;render()}}
["input","compositionend","search"].forEach(ev=>$("#search").addEventListener(ev,syncSearch));
window.addEventListener("ash:favorites-changed",()=>document.querySelectorAll(".favorite-button").forEach(syncFavoriteButton));
$("#sort").onchange=()=>render({animate:true});renderCats();render();
function pickTask(task){const c=taskMap[task];if(c){active=c;renderCats();render({animate:true})}$("#tools").scrollIntoView({behavior:"smooth",block:"start"})}

const sitebar=document.querySelector(".sitebar");
let navTick=false;
function syncNavScroll(){
  navTick=false;
  if(!sitebar)return;
  sitebar.classList.toggle("is-scrolled",window.scrollY>6);
}
window.addEventListener("scroll",()=>{
  if(navTick)return;
  navTick=true;
  requestAnimationFrame(syncNavScroll);
},{passive:true});
syncNavScroll();
document.querySelectorAll(".starter-card").forEach(b=>b.onclick=()=>pickTask(b.dataset.task));
