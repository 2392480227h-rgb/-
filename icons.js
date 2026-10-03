/* AI Starter Hub icon system
 * Brand icons: Simple Icons CDN with website-favicon fallback.
 * UI icons: lightweight inline SVGs for consistent rendering.
 */
(() => {
  const uiPaths = {
    compass: '<path d="m15 6-4.5 4.5L6 15l4.5-1.5L12 9l3-3Z"/><circle cx="12" cy="12" r="9"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
    message: '<path d="M21 11.5a8.2 8.2 0 0 1-.9 3.7 8.3 8.3 0 0 1-7.5 4.6 8.2 8.2 0 0 1-3.7-.9L3 21l1.1-5.9a8.2 8.2 0 0 1-.9-3.7A8.3 8.3 0 0 1 7.8 4a8.3 8.3 0 0 1 13.2 7.5Z"/>',
    learn: '<path d="m3 8 9-4 9 4-9 4-9-4Z"/><path d="M7 10.2V15c2.8 2.3 9.2 2.3 12 0v-4.8"/><path d="M21 8v6"/>',
    pen: '<path d="m12 20 8.5-8.5a2.1 2.1 0 0 0-3-3L9 17v3Z"/><path d="m15.5 9.5 3 3"/><path d="M4 20h5"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/>',
    video: '<rect x="3" y="5" width="14" height="14" rx="2"/><path d="m17 10 4-2.5v9L17 14"/>',
    code: '<path d="m8 9-4 3 4 3"/><path d="m16 9 4 3-4 3"/><path d="m14 5-4 14"/>',
    external: '<path d="M14 5h5v5"/><path d="M10 14 19 5"/><path d="M19 14v5H5V5h5"/>',
    arrow: '<path d="M5 12h13"/><path d="m13 6 6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H6"/><path d="m11 18-6-6 6-6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c1.2-3.3 3.8-5 8-5s6.8 1.7 8 5"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    login: '<path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M20 19V5a2 2 0 0 0-2-2h-5"/>',
    logout: '<path d="m14 17 5-5-5-5"/><path d="M19 12H7"/><path d="M11 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.9-3L3 11"/><path d="M3 5v6h6"/><path d="M4 13a8 8 0 0 0 14.9 3L21 13"/><path d="M21 19v-6h-6"/>',
    play: '<path d="m8 5 11 7-11 7V5Z"/>',
    alert: '<path d="M12 3 2.8 19h18.4L12 3Z"/><path d="M12 9v4"/><path d="M12 16h.01"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v2M22 12h-2M12 22v-2M2 12h2"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    mobile: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M10 5h4M11 18.5h2"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7.5h.01"/>'
  };

  const brandSlugs = {
    "ChatGPT":"openai",
    "Gemini":"googlegemini",
    "Claude":"anthropic",
    "Perplexity":"perplexity",
    "NotebookLM":"notebooklm",
    "Microsoft Copilot":"microsoftcopilot",
    "GitHub Copilot":"githubcopilot",
    "Gemini Code Assist":"googlegemini",
    "Cursor":"cursor",
    "Hugging Face":"huggingface",
    "Ollama":"ollama",
    "LM Studio":"lmstudio",
    "Leonardo AI":"leonardo",
    "Ideogram":"ideogram",
    "Adobe Firefly":"adobe",
    "Canva":"canva",
    "Microsoft Designer":"microsoft",
    "PhotoRoom":"photoroom",
    "CapCut":"capcut",
    "Pika":"pika",
    "Runway":"runway",
    "Kling AI":"klingai",
    "Luma Dream Machine":"luma",
    "Hailuo AI":"minimax",
    "ElevenLabs":"elevenlabs",
    "Suno":"suno",
    "Udio":"udio",
    "Gamma":"gamma",
    "Napkin AI":"napkin",
    "Descript":"descript",
    "DeepSeek":"deepseek",
    "豆包":"bytedance",
    "Kimi":"moonshot",
    "通义千问":"alibabacloud",
    "文心助手":"baidu",
    "腾讯元宝":"tencentqq",
    "智谱清言":"zhipuai",
    "秘塔AI搜索":"metaso",
    "Poe":"poe",
    "HuggingChat":"huggingface",
    "Mistral Le Chat":"mistralai",
    "Google AI Studio":"google",
    "Groq":"groq",
    "Grammarly":"grammarly",
    "QuillBot":"quillbot",
    "DeepL":"deepl",
    "Google Translate":"googletranslate",
    "Jimeng AI":"bytedance",
    "SeaArt AI":"seaart",
    "Tensor.Art":"tensorart",
    "Mage.space":"mage",
    "Craiyon":"craiyon",
    "Playground":"playground",
    "Clipdrop":"clipdrop",
    "Cleanup.pictures":"cleanup",
    "Remove.bg":"removebg",
    "OpusClip":"opus",
    "VEED":"veed",
    "InVideo AI":"invideo",
    "HeyGen":"heygen",
    "TTSMaker":"tts",
    "PlayHT":"playht",
    "AIVA":"aiva",
    "Soundraw":"soundraw",
    "Tome":"tome",
    "Beautiful.ai":"beautifulai",
    "Otter.ai":"otter",
    "Fireflies.ai":"fireflies",
    "Jan":"jan",
    "GPT4All":"gpt4all",
    "ComfyUI":"comfyui",
    "Fooocus":"stable-diffusion",
    "Stable Diffusion":"stability",
    "CodeGeeX":"zhipuai",
    "通义灵码":"alibabacloud",
    "Blackbox AI":"blackboxai",
    "Replit":"replit",
    "Phind":"phind",
    "Symbolab":"symbolab"
  };

  function svg(name, className = "") {
    const paths = uiPaths[name] || uiPaths.info;
    return '<svg class="ui-svg '+className+'" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+paths+'</svg>';
  }

  function brandUrl(name, websiteUrl) {
    const slug = brandSlugs[name];
    if (slug) return 'https://cdn.simpleicons.org/' + slug;
    try {
      const host = new URL(websiteUrl).hostname;
      return 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(host) + '&sz=128';
    } catch {
      return '';
    }
  }

  function brand(name, websiteUrl) {
    const src = brandUrl(name, websiteUrl);
    return '<span class="brand-icon" aria-hidden="true"><img src="'+src+'" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest(\'.brand-icon\').dataset.broken=\'1\'"><span class="brand-fallback">'+svg("info")+'</span></span>';
  }

  window.ASHIcons = { svg, brand, brandUrl };
})();
