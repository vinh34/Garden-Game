/**
 * Server API: đăng ký, đăng nhập, lưu/load tiến trình game
 * Chạy: npm install && npm start (mặc định port 3001)
 */

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'vuon-trai-cay-secret-key-doi-trong-moi-truong-that';
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SAVES_FILE = path.join(DATA_DIR, 'saves.json');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '{}');
  if (!fs.existsSync(SAVES_FILE)) fs.writeFileSync(SAVES_FILE, '{}');
}

function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function writeUsers(users) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function readSaves() {
  try {
    return JSON.parse(fs.readFileSync(SAVES_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function writeSaves(saves) {
  ensureDataDir();
  fs.writeFileSync(SAVES_FILE, JSON.stringify(saves, null, 2));
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  const token = auth && auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Chưa đăng nhập' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.email = decoded.email;
    next();
  } catch {
    return res.status(401).json({ error: 'Phiên đăng nhập hết hạn' });
  }
}

// Đăng ký
app.post('/api/register', (req, res) => {
  const { email, password } = req.body || {};
  const e = (email || '').trim().toLowerCase();
  const p = password || '';
  if (!e || !p) {
    return res.status(400).json({ error: 'Cần nhập email và mật khẩu' });
  }
  if (p.length < 6) {
    return res.status(400).json({ error: 'Mật khẩu tối thiểu 6 ký tự' });
  }
  const users = readUsers();
  if (users[e]) {
    return res.status(400).json({ error: 'Email đã được sử dụng' });
  }
  const hash = bcrypt.hashSync(p, 10);
  users[e] = { passwordHash: hash, createdAt: new Date().toISOString() };
  writeUsers(users);
  const token = jwt.sign({ userId: e, email: e }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, email: e });
});

// Đăng nhập
app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  const e = (email || '').trim().toLowerCase();
  const p = password || '';
  if (!e || !p) {
    return res.status(400).json({ error: 'Cần nhập email và mật khẩu' });
  }
  const users = readUsers();
  const user = users[e];
  if (!user || !bcrypt.compareSync(p, user.passwordHash)) {
    return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
  }
  const token = jwt.sign({ userId: e, email: e }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, email: e });
});

// Lấy tiến trình đã lưu (cần đăng nhập)
app.get('/api/save', authMiddleware, (req, res) => {
  const saves = readSaves();
  const data = saves[req.userId] || null;
  res.json({ save: data });
});

// Lưu tiến trình (cần đăng nhập)
app.put('/api/save', authMiddleware, (req, res) => {
  const save = req.body;
  if (!save || typeof save !== 'object') {
    return res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
  }
  const saves = readSaves();
  saves[req.userId] = {
    ...save,
    updatedAt: new Date().toISOString(),
  };
  writeSaves(saves);
  res.json({ ok: true });
});

ensureDataDir();
app.listen(PORT, () => {
  console.log('Server chạy tại http://localhost:' + PORT);
});
