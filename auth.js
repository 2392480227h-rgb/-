import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

/*
  AI Starter Hub · Google Auth
  Only put the Supabase project URL and publishable key here.
  Never put a Supabase service_role key in browser code.
*/
const SUPABASE_URL = "";
const SUPABASE_PUBLISHABLE_KEY = "";

const button = document.getElementById("authButton");
if (!button) {
  console.warn("Auth UI not found.");
} else if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  button.classList.add("auth-unconfigured");
  button.title = "Google 登录尚未配置";
  button.addEventListener("click", () => {
    window.alert("Google 登录正在配置中，请稍后再试。");
  });
} else {
  const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  const label = (name) => {
    const value = String(name || "").trim();
    if (!value) return "已登录";
    return value.length > 12 ? value.slice(0, 12) + "…" : value;
  };

  function renderUser(user) {
    if (!user) {
      button.className = "auth-button";
      button.innerHTML = '<span class="google-mark" aria-hidden="true">G</span><span>使用 Google 登录</span>';
      button.title = "使用 Google 账号登录";
      button.onclick = async () => {
        const redirectTo = window.location.origin + window.location.pathname;
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo }
        });
        if (error) window.alert("Google 登录失败：" + error.message);
      };
      return;
    }

    const name = label(user.user_metadata?.full_name || user.user_metadata?.name || user.email);
    const avatar = user.user_metadata?.avatar_url;
    button.className = "auth-button auth-user";
    button.title = "点击退出登录";
    button.innerHTML = avatar
      ? '<img src="' + String(avatar).replace(/"/g, "&quot;") + '" alt=""><span>' + name + '</span><b>退出</b>'
      : '<span class="avatar-fallback">●</span><span>' + name + '</span><b>退出</b>';
    button.onclick = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) window.alert("退出登录失败：" + error.message);
    };
  }

  supabase.auth.onAuthStateChange((_event, session) => {
    renderUser(session?.user || null);
  });

  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.warn("Auth session read failed:", error);
      return;
    }
    renderUser(data.session?.user || null);
  });
}
