(() => {
  const root = document.querySelector("[data-ai-now]");
  if (!root) return;

  const titleEl = root.querySelector("[data-ai-now-title]");
  const labelEl = root.querySelector("[data-ai-now-label]");
  const sourceEl = root.querySelector("[data-ai-now-source]");
  const linkEl = root.querySelector("[data-ai-now-link]");
  const statusEl = root.querySelector("[data-ai-now-status]");
  const language = () => window.ASHI18n?.current() || "zh";
  const newsLabel = () => language()==="en" ? "🟣 AI updates" : (language()==="zh-TW" ? "🟣 AI 動態" : "🟣 AI 动态");
  const originalLabel = () => language()==="en" ? "Original" : "原文";
  const viewLabel = () => language()==="en" ? "Read original:" : "查看原文：";

  const state = {
    items: [],
    index: -1,
    timer: 0,
    paused: false
  };

  const escapeUrl = value => {
    try {
      const url = new URL(value, location.href);
      return /^https?:$/.test(url.protocol) ? url.href : "#";
    } catch {
      return "#";
    }
  };

  const timeAgo = iso => {
    const time = new Date(iso).getTime();
    if (!Number.isFinite(time)) return "";
    const minutes = Math.max(0, Math.round((Date.now() - time) / 60000));
    if (language()==="en") { if(minutes<60)return `${minutes} min ago`; const hours=Math.round(minutes/60); if(hours<24)return `${hours} hr ago`; return `${Math.round(hours/24)} days ago`; }
    if (minutes < 60) return `${minutes} 分钟前`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} 小时前`;
    return `${Math.round(hours / 24)} 天前`;
  };

  const show = (item, immediate = false) => {
    if (!item) return;

    root.classList.remove("is-visible");
    root.classList.add("is-changing");

    const swap = () => {
      labelEl.textContent = newsLabel();
      titleEl.textContent = item.title || "AI 圈有新动态";
      sourceEl.textContent = [item.source, timeAgo(item.publishedAt)].filter(Boolean).join(" · ");
      linkEl.href = escapeUrl(item.url);
      const linkText=linkEl.querySelector("span");if(linkText)linkText.textContent=originalLabel();linkEl.setAttribute("aria-label", `${viewLabel()} ${item.title || newsLabel()}`);
      root.classList.remove("is-changing");
      requestAnimationFrame(() => root.classList.add("is-visible"));
    };

    if (immediate) swap();
    else window.setTimeout(swap, 120);
  };

  const next = () => {
    if (!state.items.length || state.paused) return;
    state.index = (state.index + 1) % state.items.length;
    show(state.items[state.index]);
  };

  const schedule = () => {
    window.clearTimeout(state.timer);
    if (!state.items.length || state.paused) return;
    state.timer = window.setTimeout(() => {
      next();
      schedule();
    }, 6500);
  };

  const pause = () => {
    state.paused = true;
    window.clearTimeout(state.timer);
  };

  const resume = () => {
    state.paused = false;
    schedule();
  };

  root.addEventListener("mouseenter", pause);
  root.addEventListener("mouseleave", resume);
  root.addEventListener("focusin", pause);
  root.addEventListener("focusout", resume);

  window.addEventListener("ash:language-changed",()=>{const linkText=linkEl.querySelector("span");if(linkText)linkText.textContent=originalLabel();if(state.items.length&&state.index>=0)show(state.items[state.index],true);else labelEl.textContent=newsLabel();});

  fetch("data/ai-news.json", { cache: "no-store" })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(payload => {
      state.items = Array.isArray(payload.items) ? payload.items.filter(item => item?.title && item?.url) : [];
      if (!state.items.length) throw new Error("No items");
      state.index = Math.floor(Math.random() * state.items.length);
      show(state.items[state.index], true);
      statusEl.textContent = "LIVE";
      schedule();
    })
    .catch(() => {
      labelEl.textContent = newsLabel();
      titleEl.textContent = language()==="en" ? "Waiting for fresh AI updates…" : (language()==="zh-TW" ? "正在等待最新 AI 情報……" : "正在等待新鲜 AI 情报……");
      sourceEl.textContent = language()==="en" ? "Syncing public sources" : (language()==="zh-TW" ? "正在同步公開來源" : "公开来源同步中");
      const linkText=linkEl.querySelector("span");if(linkText)linkText.textContent=originalLabel();
      linkEl.removeAttribute("href");
      statusEl.textContent = "SYNC";
      root.classList.add("is-visible");
    });
})();
