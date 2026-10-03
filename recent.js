(() => {
  const KEY = "aiStarterHub:recent:v1";
  const LIMIT = 12;
  function normalizeItem(item) {
    if (!item || typeof item.name !== "string") return null;
    const name = item.name.trim();
    if (!name) return null;
    return { toolId: String(item.toolId || window.ASHToolId?.fromUrl(item.url) || name), name, url: String(item.url || "").trim(), category: String(item.category || "").trim(), company: String(item.company || "").trim(), icon: String(item.icon || "⭐"), visitedAt: Number(item.visitedAt) || Date.now() };
  }
  function read() {
    try {
      const raw = localStorage.getItem(KEY), parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      const result = [], seen = new Set();
      for (const item of parsed) {
        const normalized = normalizeItem(item);
        if (normalized && !seen.has(normalized.toolId)) { seen.add(normalized.toolId); result.push(normalized); }
      }
      return result.sort((a,b)=>b.visitedAt-a.visitedAt).slice(0,LIMIT);
    } catch (error) { console.warn("Recent read failed:", error); return []; }
  }
  function emit(items) { window.dispatchEvent(new CustomEvent("ash:recent-changed", { detail: { recent: items } })); }
  function write(items) {
    const clean = items.map(normalizeItem).filter(Boolean).sort((a,b)=>b.visitedAt-a.visitedAt).slice(0,LIMIT);
    try { localStorage.setItem(KEY, JSON.stringify(clean)); } catch (error) { console.warn("Recent write failed:", error); }
    emit(clean);
    return clean;
  }
  function add(item) {
    const normalized = normalizeItem(item);
    if (!normalized) return read();
    const current = read().filter(entry => entry.toolId !== normalized.toolId);
    return write([{ ...normalized, visitedAt: Date.now() }, ...current]);
  }
  function remove(toolId) { return write(read().filter(item => item.toolId !== String(toolId))); }
  function clear() { return write([]); }
  window.addEventListener("storage", event => { if (event.key === KEY) emit(read()); });
  window.ASHRecent = { KEY, getAll: read, add, remove, clear };
})();
