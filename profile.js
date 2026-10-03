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

function renderSession(session) {
  const user = session?.user || null;
  const loggedIn = Boolean(user);
  signedOut.hidden = loggedIn;
  signedIn.hidden = !loggedIn;

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

supabase.auth.onAuthStateChange((_event, session) => renderSession(session));

supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.warn("Auth session read failed:", error);
    setStatus("登录状态读取失败");
    return;
  }
  renderSession(data.session);
});
