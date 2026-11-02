// src/services/authStorage.js
// Helpers de persistência de tokens JWT.
// Centraliza o acesso ao localStorage para facilitar migração futura (cookies httpOnly).

const ACCESS_KEY = 'quarkops_access_token';
const REFRESH_KEY = 'quarkops_refresh_token';
const USER_KEY = 'quarkops_user';

export const authStorage = {
  getAccess() {
    return localStorage.getItem(ACCESS_KEY);
  },

  getRefresh() {
    return localStorage.getItem(REFRESH_KEY);
  },

  getUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setTokens({ access, refresh }) {
    if (access) localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },

  setUser(user) {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  },

  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
};