/**
 * Đăng nhập / đăng ký và đồng bộ tiến trình lên server
 */

const AUTH_TOKEN_KEY = 'vuon_trai_cay_token';
const AUTH_EMAIL_KEY = 'vuon_trai_cay_email';

// Đổi thành địa chỉ server của bạn khi deploy (ví dụ: https://api.example.com)
const API_BASE = window.VUON_API_BASE || '';

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

async function request(method, path, body, needAuth = true) {
  const url = (API_BASE + path).replace(/([^:]\/)\/+/g, '$1');
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  const token = getToken();
  if (needAuth && token) opts.headers.Authorization = 'Bearer ' + token;
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Lỗi kết nối');
  return data;
}

async function login(email, password) {
  const data = await request('POST', '/api/login', { email, password }, false);
  setToken(data.token, data.email);
  return data;
}

async function register(email, password) {
  const data = await request('POST', '/api/register', { email, password }, false);
  setToken(data.token, data.email);
  return data;
}

async function loadSaveFromServer() {
  if (!getToken()) return null;
  try {
    const data = await request('GET', '/api/save');
    return data.save || null;
  } catch {
    return null;
  }
}

async function saveGameToServer(saveData) {
  if (!getToken()) return false;
  try {
    await request('PUT', '/api/save', saveData);
    return true;
  } catch {
    return false;
  }
}

function logout() {
  removeToken();
}
