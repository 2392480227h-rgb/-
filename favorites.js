(() => {
  const KEY = "aiStarterHub:favorites:v1";

  function normalizeItem(item) {
    if (typeof item === "string") {
      const name = item.trim();
      return name ? { name, url: "", category: "", company: "", icon: "⭐" } : null;
    }
    if (!item || typeof item.name !== "string") return null;
    const name = item.name.trim();
    if (!name) return null;
    return {
      name,
      url: String(item.url || "").trim(),
      category: String(item.category || "").trim(),
      company: String(item.company || "").trim(),
      icon: String(item.icon || "⭐")
    };
  }

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      const result = [];
      const seen = new Set();
      for (const item of parsed) {
        const normalized = normalizeItem(item);
        if (normalized && !seen.has(normalized.name)) {
          seen.add(normalized.name);
          result.push(normalized);
        }
      }
      return result;
    } catch (error) {
      console.warn("Favorites read failed:", error);
      return [];
    }
  }

  function emit(favorites) {
    window.dispatchEvent(new CustomEvent("ash:favorites-changed", {
      detail: { favorites }
    }));
  }

  function write(favorites) {
    const clean = [];
    const seen = new Set();
    for (const item of favorites) {
      const normalized = normalizeItem(item);
      if (normalized && !seen.has(normalized.name)) {
        seen.add(normalized.name);
        clean.push(normalized);
      }
    }

    try {
      localStorage.setItem(KEY, JSON.stringify(clean));
    } catch (error) {
      console.warn("Favorites write failed:", error);
    }
    emit(clean);
    return clean;
  }

  function has(name) {
    return read().some(item => item.name === String(name));
  }

  function toggle(item) {
    const normalized = normalizeItem(item);
    if (!normalized) return { favorite: false, favorites: read() };

    const current = read();
    const index = current.findIndex(entry => entry.name === normalized.name);

    if (index >= 0) {
      const next = current.filter(entry => entry.name !== normalized.name);
      return { favorite: false, favorites: write(next) };
    }

    return { favorite: true, favorites: write([normalized, ...current]) };
  }

  window.addEventListener("storage", event => {
    if (event.key === KEY) emit(read());
  });

  window.ASHFavorites = {
    KEY,
    getAll: read,
    has,
    toggle
  };
})();
