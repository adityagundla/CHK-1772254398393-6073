// Simple client-side auth implementation for demo purposes.
// NOTE: This is NOT secure and should not be used in production.

const USERS_KEY = 'users';
const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const USER_TYPE_KEY = 'userType';

const generateToken = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

const loadUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const signup = ({ name, email, password }) => {
  const users = loadUsers();
  if (users[email]) {
    throw new Error('Email already registered');
  }

  const uid = generateToken();
  users[email] = {
    name,
    password,
    uid,
    registeredAt: new Date().toISOString()
  };

  saveUsers(users);

  const token = generateToken();
  const userData = {
    name,
    email,
    uid,
    registeredAt: users[email].registeredAt
  };

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
  localStorage.setItem(USER_TYPE_KEY, 'user');
  window.dispatchEvent(new Event('storage'));

  return { userData, token };
};

export const login = ({ email, password }) => {
  const users = loadUsers();
  const user = users[email];
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken();
  const userData = {
    name: user.name,
    email,
    uid: user.uid
  };

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
  localStorage.setItem(USER_TYPE_KEY, 'user');
  window.dispatchEvent(new Event('storage'));

  return { userData, token };
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_TYPE_KEY);
  window.dispatchEvent(new Event('storage'));
};
