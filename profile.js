import { supabase, signInWithGoogle } from "./auth.js";

const $ = (id) => document.getElementById(id);
const signedOut = $("signedOut");
const signedIn = $("signedIn");
const status = $("profileStatus");
let currentSession = null;
const T = (key, fallback = key, ...args) => window.ASHI18n?.t(key, ...args) ?? fallback;

function setStatus(text, loggedIn = false) {
  if (!status) return;
  status.textContent = text;
  status.classList.toggle("is-logged-in", loggedIn);
}

function fallbackAvatar(user) {
  const name = String(user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email || "U").trim();
  return name ? name.slice(0, 1).toUpperCase() : "U";
}

function renderAvatar(user) {
  const box = $("profileAvatar");
  if (!box) return;
  const avatar = String(user?.user_metadata?.avatar_url || "").trim();
  box.replaceChildren();

  if (avatar) {
    const img = document.createElement("img");
    img.src = avatar;
    img.alt = "";
    img.referrerPolicy = "no-referrer";
    box.append(img);
    return;
  }

  box.textContent = fallbackAvatar(user);
}

function relativeTime(timestamp) {
  const diff = Math.max(0, Date.now() - Number(timestamp || 0));
  const minute = 60 * 1000, hour = 60 * minute, day = 24 * hour;
  const lang = window.ASHI18n?.current?.() || "zh";
  if (diff < minute) return lang === "en" ? "just now" : (lang === "zh-TW" ? "剛剛" : "刚刚");
  if (diff < hour) { const n = Math.floor(diff / minute); return lang === "en" ? `${n} min ago` : `${n} ${lang === "zh-TW" ? "分鐘前" : "分钟前"}`; }
  if (diff < day) { const n = Math.floor(diff / hour); return lang === "en" ? `${n} hr ago` : `${n} ${lang === "zh-TW" ? "小時前" : "小时前"}`; }
  if (diff < 7 * day) { const n = Math.floor(diff / day); return lang === "en" ? `${n} days ago` : `${n} ${lang === "zh-TW" ? "天前" : "天前"}`; }
  return new Date(timestamp).toLocaleDateString(lang === "en" ? "en-US" : (lang === "zh-TW" ? "zh-TW" : "zh-CN"));
}

function renderToolBrandIcon(container, item) {
  container.replaceChildren();
  const src = window.ASHIcons?.brandUrl?.(item.name, item.url);
  if (!src) {
    container.textContent = item.icon || "⭐";
    return;
  }

  const img = document.createElement("img");
  img.src = src;
  img.alt = "";
  img.loading = "lazy";
  img.referrerPolicy = "no-referrer";

  let triedFallback = false;
  img.onerror = () => {
    if (!triedFallback) {
      triedFallback = true;
      try {
        const host = new URL(item.url).hostname;
        if (host) {
          img.src = "https://" + host + "/favicon.ico";
          return;
        }
      } catch {}
    }
    img.remove();
  };

  container.append(img);
}

function renderFavorites() {
  const list = $("favoritesList"), empty = $("favoritesEmpty"), summary = $("favoriteSummary");
  if (!list || !empty) return;
  const favorites = window.ASHFavorites?.getAll?.() || [];
  if (summary) summary.textContent = T("profileFavoritesCount", `${favorites.length} 个工具`, favorites.length);
  list.replaceChildren();
  empty.hidden = favorites.length > 0;
  for (const item of favorites) {
    const article = document.createElement("article"); article.className = "favorite-item";
    const icon = document.createElement("div"); icon.className = "favorite-item-icon";
    renderToolBrandIcon(icon, item);
    const copy = document.createElement("div"); copy.className = "favorite-item-copy";
    const name = document.createElement("strong"); name.textContent = item.name;
    const meta = document.createElement("small"); meta.textContent = [window.ASHI18n?.category?.(item.category) || item.category, item.company].filter(Boolean).join(" · ");
    copy.append(name, meta);
    const actions = document.createElement("div"); actions.className = "favorite-item-actions";
    if (item.url) {
      const open = document.createElement("a"); open.className = "secondary-button favorite-open"; open.href = item.url; open.target = "_blank"; open.rel = "noopener noreferrer"; open.textContent = T("profileOpen", "打开"); actions.append(open);
    }
    const remove = document.createElement("button"); remove.className = "danger-button favorite-remove"; remove.type = "button"; remove.textContent = T("profileRemove", "取消收藏");
    remove.addEventListener("click", () => window.ASHFavorites?.toggle(item)); actions.append(remove);
    article.append(icon, copy, actions); list.append(article);
  }
}

function renderRecent() {
  const list = $("recentList"), empty = $("recentEmpty"), summary = $("recentSummary"), clearButton = $("clearRecentButton");
  if (!list || !empty) return;
  const recent = window.ASHRecent?.getAll?.() || [];
  if (summary) summary.textContent = T("profileFavoritesCount", `${recent.length} 个工具`, recent.length);
  if (clearButton) clearButton.disabled = recent.length === 0;
  list.replaceChildren();
  empty.hidden = recent.length > 0;
  for (const item of recent) {
    const article = document.createElement("article"); article.className = "recent-item";
    const icon = document.createElement("div"); icon.className = "recent-item-icon";
    renderToolBrandIcon(icon, item);
    const copy = document.createElement("div"); copy.className = "recent-item-copy";
    const name = document.createElement("strong"); name.textContent = item.name;
    const meta = document.createElement("small"); meta.textContent = [relativeTime(item.visitedAt), window.ASHI18n?.category?.(item.category) || item.category, item.company].filter(Boolean).join(" · ");
    copy.append(name, meta);
    const actions = document.createElement("div"); actions.className = "recent-item-actions";
    if (item.url) {
      const open = document.createElement("a"); open.className = "secondary-button"; open.href = item.url; open.target = "_blank"; open.rel = "noopener noreferrer"; open.textContent = T("profileAgain", "再次打开"); actions.append(open);
    }
    const remove = document.createElement("button"); remove.className = "danger-button"; remove.type = "button"; remove.textContent = T("profileRemoveRecent", "移除");
    remove.addEventListener("click", () => window.ASHRecent?.remove(item.toolId)); actions.append(remove);
    article.append(icon, copy, actions); list.append(article);
  }
}

function renderSession(session) {
  currentSession = session;
  const user = session?.user || null;
  const loggedIn = Boolean(user);
  signedOut.hidden = loggedIn;
  signedIn.hidden = !loggedIn;

  // Update the auth status first. Rendering saved/recent tools must never
  // leave the header stuck on "Checking sign-in status…".
  setStatus(
    T(loggedIn ? "profileLogged" : "profileNotLogged", loggedIn ? "● 已登录" : "● 未登录"),
    loggedIn
  );

  try {
    renderFavorites();
    renderRecent();
  } catch (error) {
    console.warn("Profile list render failed:", error);
  }

  if (!loggedIn) return;

  const rawName = String(user.user_metadata?.name || user.user_metadata?.full_name || T("profileDefaultUser", "已登录用户")).trim();
  const name = rawName.split("(")[0].trim() || rawName || "已登录用户";
  $("profileName").textContent = name;
  $("profileEmail").textContent = String(user.email || T("profileGoogleAccount", "Google 账号"));
  renderAvatar(user);
  setStatus(T("profileLogged", "● 已登录"), true);
}

async function startLogin(forceAccountSelect = false) {
  const result = await signInWithGoogle({
    redirectTo: new URL("./profile.html", window.location.href).href,
    prompt: forceAccountSelect ? "select_account" : undefined
  });
  if (result?.error) window.alert(T("profileLoginError", "Google 登录失败：") + result.error.message);
}

document.querySelectorAll("[data-icon]").forEach(el => { el.innerHTML = window.ASHIcons.svg(el.dataset.icon); });

$("signInButton")?.addEventListener("click", () => startLogin(false));
$("switchAccountButton")?.addEventListener("click", () => startLogin(true));
$("signOutButton")?.addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) window.alert(T("profileSignOutError", "退出登录失败：") + error.message);
});

window.addEventListener("ash:language-changed", () => { renderFavorites(); renderRecent(); renderSession(currentSession); });
window.addEventListener("ash:favorites-changed", renderFavorites);
window.addEventListener("ash:recent-changed", renderRecent);
$("clearRecentButton")?.addEventListener("click", () => window.ASHRecent?.clear());

supabase.auth.onAuthStateChange((_event, session) => renderSession(session));

supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.warn("Auth session read failed:", error);
    setStatus(T("profileSessionError", "登录状态读取失败"));
    return;
  }
  renderSession(data.session);
});
