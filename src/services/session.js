// Сессия пользователя: пара access/refresh токенов.
// Хранится в localStorage, чтобы вход переживал перезагрузку страницы.
// Токены читаются только через этот модуль — не дублируйте их в компонентах.

const STORAGE_KEY = 'session';

// Старый вход хранил JWT строкой в 'token' — с новым API он не работает
localStorage.removeItem('token');
localStorage.removeItem('email');

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

let session = read();
// Номер сессии меняется при входе и выходе: ответы от старой сессии не должны влиять на новую
let version = 0;
const listeners = new Set();

const notify = () => listeners.forEach((listener) => listener(session));

const write = (value) => {
  session = value;
  if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  else localStorage.removeItem(STORAGE_KEY);
};

export const getSession = () => session;
export const getSessionVersion = () => version;
export const isAuthenticated = () => !!session?.accessToken;

// Новый вход
export const setSession = (pair) => {
  version += 1;
  write({ ...pair, sid: `${Date.now()}-${Math.random()}` });
  notify();
};

// Обновление токенов той же сессии (refresh) — номер сессии не меняется
export const replaceTokens = (pair) => {
  write({ ...pair, sid: session?.sid });
};

export const clearSession = () => {
  version += 1;
  write(null);
  notify();
};

// Подписка на вход и выход; возвращает функцию отписки
export const onSessionChange = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// Вход, выход или обновление токенов в другой вкладке
window.addEventListener('storage', (e) => {
  if (e.key !== STORAGE_KEY) return;
  const next = read();
  const sameSession = next && session && next.sid === session.sid;
  session = next;
  if (!sameSession) {
    version += 1;
    notify();
  }
});
