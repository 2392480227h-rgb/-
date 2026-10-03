(() => {
  const KEY = "aiStarterHub:favorites:v2";
  const LEGACY_KEY = "aiStarterHub:favorites:v1";
  function makeId(item) {
    if (item?.toolId) return String(item.toolId);
    return window.ASHToolId?.fromUrl(item?.url) || String(item?.name || "").trim();
  }
  function normalizeItem(item) {
    if (typeof item === "string") {
      const name = item.trim();
      return name ? { toolId: makeId({ name }), name, url: "", category: "", company: "", icon: "⭐" } : null;
    }
    if (!item || typeof item.name !== "string") return null;
    const name = item.name.trim();
    if (!name) return null;
    return { toolId: makeId(item), name, url: String(item.url || "").trim(), category: String(item.category || "").trim(), company: String(item.company || "").trim(), icon: String(item.icon || "⭐") };
  }
  function readKey(key) {
    try {
      const raw = localStorage.getItem(key), parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) { console.warn("Favorites read failed:", error); return []; }
  }
  function clean(items) {
    const result = [], seen = new Set();
    for (const item of items) {
      const normalized = normalizeItem(item);
      if (normalized && !seen.has(normalized.toolId)) { seen.add(normalized.toolId); result.push(normalized); }
    }
    return result;
  }
  function read() {
    const current = clean(readKey(KEY));
    let hasCurrent = false;
    try { hasCurrent = localStorage.getItem(KEY) !== null; } catch (error) { console.warn("Favorites storage check failed:", error); }
    if (hasCurrent) return current;

    const migrated = clean(readKey(LEGACY_KEY));
    if (migrated.length) {
      try {
        localStorage.setItem(KEY, JSON.stringify(migrated));
        localStorage.removeItem(LEGACY_KEY);
      } catch (error) {
        console.warn("Favorites migration failed:", error);
      }
    }
    return migrated;
  }
  function emit(favorites) { window.dispatchEvent(new CustomEvent("ash:favorites-changed", { detail: { favorites } })); }
  function write(favorites) {
    const cleanItems = clean(favorites);
    try { localStorage.setItem(KEY, JSON.stringify(cleanItems)); } catch (error) { console.warn("Favorites write failed:", error); }
    emit(cleanItems);
    return cleanItems;
  }
  function has(idOrItem) {
    const id = typeof idOrItem === "string" ? idOrItem : makeId(idOrItem);
    return read().some(item => item.toolId === id || item.name === id);
  }
  function toggle(item) {
    const normalized = normalizeItem(item);
    if (!normalized) return { favorite: false, favorites: read() };
    const current = read();
    if (current.some(entry => entry.toolId === normalized.toolId)) {
      return { favorite: false, favorites: write(current.filter(entry => entry.toolId !== normalized.toolId)) };
    }
    return { favorite: true, favorites: write([normalized, ...current]) };
  }
  window.addEventListener("storage", event => {
    if (event.key === KEY || event.key === LEGACY_KEY) emit(read());
  });
  window.ASHFavorites = { KEY, getAll: read, has, toggle };
})();
