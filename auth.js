import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

/*
  AI Starter Hub · Google Auth
  The publishable key is intended for browser code.
  Never put a Supabase secret/service_role key here.
*/
const SUPABASE_URL = "https://rebwsnahwpyqahmuycri.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_TVRAm1r1Er3xBfrtA6Q8DA_eeCYqQZk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export async function signInWithGoogle({ redirectTo, prompt } = {}) {
  const options = {
    redirectTo: redirectTo || (window.location.origin + window.location.pathname)
  };
  if (prompt) options.queryParams = { prompt };

  return supabase.auth.signInWithOAuth({
    provider: "google",
    options
  });
}

const button = document.getElementById("authButton");

function label(name) {
  const value = String(name || "").trim();
  if (!value) return "已登录";
  return value.length > 12 ? value.slice(0, 12) + "…" : value;
}

function makeText(tag, text, className) {
  const el = document.createElement(tag);
  el.textContent = text;
  if (className) el.className = className;
  return el;
}

function renderUser(user) {
  if (!button) return;

  button.replaceChildren();

  if (!user) {
    button.className = "auth-button";
    button.title = "使用 Google 账号登录";

    const mark = makeText("span", "G", "google-mark");
    mark.setAttribute("aria-hidden", "true");
    button.append(mark, makeText("span", "使用 Google 登录"));

    button.onclick = async () => {
      const { error } = await signInWithGoogle();
      if (error) window.alert("Google 登录失败：" + error.message);
    };
    return;
  }

  const name = label(user.user_metadata?.full_name || user.user_metadata?.name || user.email);
  const avatar = String(user.user_metadata?.avatar_url || "").trim();

  button.className = "auth-button auth-user";
  button.title = "打开个人主页";

  if (avatar) {
    const img = document.createElement("img");
    img.src = avatar;
    img.alt = "";
    img.referrerPolicy = "no-referrer";
    button.append(img);
  } else {
    button.append(makeText("span", "●", "avatar-fallback"));
  }

  button.append(
    makeText("span", name),
    makeText("b", "我的")
  );

  button.onclick = () => {
    window.location.href = new URL("./profile.html", window.location.href).href;
  };
}

if (SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY) {
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
} else if (button) {
  button.classList.add("auth-unconfigured");
  button.title = "Google 登录尚未配置";
  button.addEventListener("click", () => {
    window.alert("Google 登录正在配置中，请稍后再试。");
  });
}
