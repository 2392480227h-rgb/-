import { supabase, signInWithGoogle } from "./auth.js";

const $ = (id) => document.getElementById(id);
const signedOut = $("signedOut");
const signedIn = $("signedIn");
const status = $("profileStatus");

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
  if (diff < minute) return "刚刚";
  if (diff < hour) return Math.floor(diff / minute) + " 分钟前";
  if (diff < day) return Math.floor(diff / hour) + " 小时前";
  if (diff < 7 * day) return Math.floor(diff / day) + " 天前";
  return new Date(timestamp).toLocaleDateString();
}

function renderFavorites() {
  const list = $("favoritesList"), empty = $("favoritesEmpty"), count = $("favoriteCount"), summary = $("favoriteSummary");
  if (!list || !empty) return;
  const favorites = window.ASHFavorites?.getAll?.() || [];
  if (count) count.textContent = String(favorites.length);
  if (summary) summary.textContent = `${favorites.length} 个工具`;
  list.replaceChildren();
  empty.hidden = favorites.length > 0;
  for (const item of favorites) {
    const article = document.createElement("article"); article.className = "favorite-item";
    const icon = document.createElement("div"); icon.className = "favorite-item-icon";
    if (window.ASHIcons?.brand) icon.innerHTML = window.ASHIcons.brand(item.name, item.url);
    else icon.textContent = item.icon || "⭐";
    const copy = document.createElement("div"); copy.className = "favorite-item-copy";
    const name = document.createElement("strong"); name.textContent = item.name;
    const meta = document.createElement("small"); meta.textContent = [item.category, item.company].filter(Boolean).join(" · ");
    copy.append(name, meta);
    const actions = document.createElement("div"); actions.className = "favorite-item-actions";
    if (item.url) {
      const open = document.createElement("a"); open.className = "secondary-button favorite-open"; open.href = item.url; open.target = "_blank"; open.rel = "noopener noreferrer"; open.textContent = "打开"; actions.append(open);
    }
    const remove = document.createElement("button"); remove.className = "danger-button favorite-remove"; remove.type = "button"; remove.textContent = "取消收藏";
    remove.addEventListener("click", () => window.ASHFavorites?.toggle(item)); actions.append(remove);
    article.append(icon, copy, actions); list.append(article);
  }
}

function renderRecent() {
  const list = $("recentList"), empty = $("recentEmpty"), count = $("recentCount"), summary = $("recentSummary"), clearButton = $("clearRecentButton");
  if (!list || !empty) return;
  const recent = window.ASHRecent?.getAll?.() || [];
  if (count) count.textContent = String(recent.length);
  if (summary) summary.textContent = `${recent.length} 个工具`;
  if (clearButton) clearButton.disabled = recent.length === 0;
  list.replaceChildren();
  empty.hidden = recent.length > 0;
  for (const item of recent) {
    const article = document.createElement("article"); article.className = "recent-item";
    const icon = document.createElement("div"); icon.className = "recent-item-icon"; icon.textContent = item.icon || "⭐";
    const copy = document.createElement("div"); copy.className = "recent-item-copy";
    const name = document.createElement("strong"); name.textContent = item.name;
    const meta = document.createElement("small"); meta.textContent = [relativeTime(item.visitedAt), item.category, item.company].filter(Boolean).join(" · ");
    copy.append(name, meta);
    const actions = document.createElement("div"); actions.className = "recent-item-actions";
    if (item.url) {
      const open = document.createElement("a"); open.className = "secondary-button"; open.href = item.url; open.target = "_blank"; open.rel = "noopener noreferrer"; open.textContent = "再次打开"; actions.append(open);
    }
    const remove = document.createElement("button"); remove.className = "danger-button"; remove.type = "button"; remove.textContent = "移除";
    remove.addEventListener("click", () => window.ASHRecent?.remove(item.toolId)); actions.append(remove);
    article.append(icon, copy, actions); list.append(article);
  }
}

function renderSession(session) {
  const user = session?.user || null;
  const loggedIn = Boolean(user);
  signedOut.hidden = loggedIn;
  signedIn.hidden = !loggedIn;

  renderFavorites();
  renderRecent();

  if (!loggedIn) {
    setStatus("● 未登录", false);
    return;
  }

  const rawName = String(user.user_metadata?.name || user.user_metadata?.full_name || "已登录用户").trim();
  const name = rawName.split("(")[0].trim() || rawName || "已登录用户";
  $("profileName").textContent = name;
  $("profileEmail").textContent = String(user.email || "Google 账号");
  renderAvatar(user);
  setStatus("● 已登录", true);
}

async function startLogin(forceAccountSelect = false) {
  const result = await signInWithGoogle({
    redirectTo: new URL("./profile.html", window.location.href).href,
    prompt: forceAccountSelect ? "select_account" : undefined
  });
  if (result?.error) window.alert("Google 登录失败：" + result.error.message);
}

document.querySelectorAll("[data-icon]").forEach(el => { el.innerHTML = window.ASHIcons.svg(el.dataset.icon); });

$("signInButton")?.addEventListener("click", () => startLogin(false));
$("switchAccountButton")?.addEventListener("click", () => startLogin(true));
$("signOutButton")?.addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) window.alert("退出登录失败：" + error.message);
});

window.addEventListener("ash:favorites-changed", renderFavorites);
window.addEventListener("ash:recent-changed", renderRecent);
$("clearRecentButton")?.addEventListener("click", () => window.ASHRecent?.clear());

supabase.auth.onAuthStateChange((_event, session) => renderSession(session));

supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.warn("Auth session read failed:", error);
    setStatus("登录状态读取失败");
    return;
  }
  renderSession(data.session);
});
