import { supabase, signInWithGoogle } from "./auth.js";

const $ = (id) => document.getElementById(id);
const signedOut = $("signedOut");
const signedIn = $("signedIn");
const status = $("profileStatus");

function setStatus(text) {
  if (status) status.textContent = text;
}

function fallbackAvatar(user) {
  const name = String(user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "U").trim();
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

function renderFavorites() {
  const list = $("favoritesList");
  const empty = $("favoritesEmpty");
  const count = $("favoriteCount");
  const summary = $("favoriteSummary");
  if (!list || !empty) return;

  const favorites = window.ASHFavorites?.getAll?.() || [];
  if (count) count.textContent = String(favorites.length);
  if (summary) summary.textContent = `${favorites.length} 个工具`;

  list.replaceChildren();
  empty.hidden = favorites.length > 0;

  for (const item of favorites) {
    const article = document.createElement("article");
    article.className = "favorite-item";

    const icon = document.createElement("div");
    icon.className = "favorite-item-icon";
    icon.textContent = item.icon || "⭐";

    const copy = document.createElement("div");
    copy.className = "favorite-item-copy";

    const name = document.createElement("strong");
    name.textContent = item.name;

    const meta = document.createElement("small");
    meta.textContent = [item.category, item.company].filter(Boolean).join(" · ");

    copy.append(name, meta);

    const actions = document.createElement("div");
    actions.className = "favorite-item-actions";

    if (item.url) {
      const open = document.createElement("a");
      open.className = "secondary-button favorite-open";
      open.href = item.url;
      open.target = "_blank";
      open.rel = "noopener noreferrer";
      open.textContent = "打开";
      actions.append(open);
    }

    const remove = document.createElement("button");
    remove.className = "danger-button favorite-remove";
    remove.type = "button";
    remove.textContent = "取消收藏";
    remove.addEventListener("click", () => {
      if (!window.ASHFavorites) return;
      window.ASHFavorites.toggle(item);
    });
    actions.append(remove);

    article.append(icon, copy, actions);
    list.append(article);
  }
}

function renderSession(session) {
  const user = session?.user || null;
  const loggedIn = Boolean(user);
  signedOut.hidden = loggedIn;
  signedIn.hidden = !loggedIn;

  renderFavorites();

  if (!loggedIn) {
    setStatus("未登录");
    return;
  }

  const name = String(user.user_metadata?.full_name || user.user_metadata?.name || "已登录用户").trim() || "已登录用户";
  $("profileName").textContent = name;
  $("profileEmail").textContent = String(user.email || "Google 账号");
  renderAvatar(user);
  setStatus("● 已登录");
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

supabase.auth.onAuthStateChange((_event, session) => renderSession(session));

supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.warn("Auth session read failed:", error);
    setStatus("登录状态读取失败");
    return;
  }
  renderSession(data.session);
});
