(() => {
  const PREFIX = "ash-";
  function hash(value) {
    let h1 = 2166136261;
    let h2 = 2246822519;
    const s = String(value || "");
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 16777619);
      h2 = Math.imul(h2 ^ c, 3266489917);
    }
    return ((h1 >>> 0).toString(36) + (h2 >>> 0).toString(36)).slice(0, 10);
  }
  function normalizeUrl(url) {
    return String(url || "").trim().toLowerCase().replace(/\/+$/, "");
  }
  function fromUrl(url) {
    const normalized = normalizeUrl(url);
    return normalized ? PREFIX + hash(normalized) : "";
  }
  window.ASHToolId = { fromUrl };
})();
