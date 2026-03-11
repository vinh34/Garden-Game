
const AUTH_TOKEN_KEY = 'vuon_trai_cay_token';
const AUTH_EMAIL_KEY = 'vuon_trai_cay_email';
const SAVES_TABLE = 'game_saves';


function getSupabase() {
  if (supabase) return supabase;
  const url = window.SUPABASE_URL || '';
  const key = window.SUPABASE_ANON_KEY || '';

  
  if (!url || !key) return null;
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    supabase = window.supabase.createClient(url, key);
    return supabase;
  }
  return null;
}

/** Gọi khi trang load để khôi phục session từ Supabase */
async function initAuth() {
  const sb = getSupabase();
  if (!sb) return;
  try {
    const { data: { session } } = await sb.auth.getSession();
    if (session) {
      localStorage.setItem(AUTH_TOKEN_KEY, session.access_token);
      localStorage.setItem(AUTH_EMAIL_KEY, session.user?.email || '');
    }
  } catch (_) {}
}

function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function setToken(token, email) {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  if (email) localStorage.setItem(AUTH_EMAIL_KEY, email);
}

function removeToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_EMAIL_KEY);
}

function getEmail() {
  return localStorage.getItem(AUTH_EMAIL_KEY) || '';
}

function isLoggedIn() {
  return !!getToken();
}

async function login(email, password) {
  const sb = getSupabase();
  if (!sb) throw new Error('Chưa cấu hình Supabase. Thêm SUPABASE_URL và SUPABASE_ANON_KEY.');
  const { data, error } = await sb.auth.signInWithPassword({
    email: (email || '').trim().toLowerCase(),
    password: password || '',
  });
  if (error) throw new Error(error.message === 'Invalid login credentials' ? 'Email hoặc mật khẩu không đúng' : error.message);
  setToken(data.session.access_token, data.user.email);
  return { token: data.session.access_token, email: data.user.email };
}

async function register(email, password) {
  const sb = getSupabase();
  if (!sb) throw new Error('Chưa cấu hình Supabase. Thêm SUPABASE_URL và SUPABASE_ANON_KEY.');

  
  const { data, error } = await sb.auth.signUp({
    email: (email || '').trim().toLowerCase(),
    password: password || '',
  });
  if (error) {
    const msg = error.message || '';
    if (msg.includes('already registered')) throw new Error('Email đã được sử dụng');
    throw new Error(error.message);
  }
  if (data.session) {
    setToken(data.session.access_token, data.user.email);
    return {
      token: data.session.access_token,
      email: data.user.email,
      requiresEmailConfirmation: false,
    };
  }
  return {
    token: null,
    email: data.user?.email || (email || '').trim().toLowerCase(),
    requiresEmailConfirmation: true,
  };
}

async function loadSaveFromServer() {
  const sb = getSupabase();
  if (!sb || !getToken()) return null;
  try {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return null;
    const { data, error } = await sb
      .from(SAVES_TABLE)
      .select('save_data')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error) return null;
    return (data && data.save_data) ? data.save_data : null;
  } catch {
    return null;
  }
}

async function saveGameToServer(saveData) {
  const sb = getSupabase();
  if (!sb || !getToken()) return false;
  try {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return false;
    const { error } = await sb
      .from(SAVES_TABLE)
      .upsert({
        user_id: user.id,
        save_data: saveData,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    return !error;
  } catch {
    return false;
  }
}

async function logout() {
  const sb = getSupabase();
  if (sb) {
    try { await sb.auth.signOut(); } catch (_) {}
  }
  removeToken();
}
// Expose auth APIs explicitly on window to avoid missing global bindings across browsers
window.initAuth = initAuth;
window.getToken = getToken;
window.setToken = setToken;
window.removeToken = removeToken;
window.getEmail = getEmail;
window.isLoggedIn = isLoggedIn;
window.login = login;
window.register = register;
window.loadSaveFromServer = loadSaveFromServer;
window.saveGameToServer = saveGameToServer;
window.logout = logout;