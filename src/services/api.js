import axios from 'axios';
import { createMockApi } from './mockApi';
import {
  getSession,
  getSessionVersion,
  setSession,
  replaceTokens,
  clearSession,
  isAuthenticated
} from './session';

// На сайте API доступен по /api. При локальной разработке (npm start) запросы идут
// на рабочий сервер; другой адрес можно задать через REACT_APP_API_URL в .env
export const API_URL = process.env.REACT_APP_API_URL
  || (process.env.NODE_ENV === 'development' ? 'https://www.simultech.ru/api' : '/api');

// Публичные запросы: вход, регистрация, ссылки из писем, refresh и logout.
// Токен сюда не добавляется — сервер проверяет даже устаревший токен и может вернуть 401
export const publicApi = axios.create({ baseURL: API_URL, timeout: 20000 });

// Запросы с авторизацией: access-токен в заголовке и автоматическое обновление сессии
export const api = axios.create({ baseURL: API_URL, timeout: 20000 });

// Демо-режим без бэкенда: REACT_APP_MOCK=teacher | student | user в .env.development.local
const MOCK_ROLE = process.env.REACT_APP_MOCK;
const mock = MOCK_ROLE ? createMockApi(MOCK_ROLE) : null;
if (mock && !isAuthenticated()) setSession({ accessToken: 'demo', refreshToken: 'demo' });

// ===== Обновление токенов =====

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Все запросы, получившие 401 одновременно, ждут один общий refresh
let refreshTask = null;

const refreshOnce = (version) => {
  if (refreshTask?.version === version) return refreshTask.promise;

  const sentToken = getSession().refreshToken;
  const task = { version };
  task.promise = publicApi.post('/auth/refresh', { refreshToken: sentToken })
    .then(({ data }) => {
      // Выход или новый вход во время refresh не должны вернуть старую сессию
      if (getSessionVersion() !== version) throw new Error('Session changed');
      replaceTokens(data);
    })
    .catch(async (err) => {
      // Токены могла обновить другая вкладка — тогда старый refresh уже отозван
      await wait(500);
      const current = getSession();
      if (current && current.refreshToken !== sentToken && getSessionVersion() === version) return;
      throw err;
    })
    .finally(() => {
      if (refreshTask === task) refreshTask = null;
    });
  refreshTask = task;
  return task.promise;
};

api.interceptors.request.use((config) => {
  const session = getSession();
  config._sessionVersion = getSessionVersion();
  config._accessToken = session?.accessToken;
  if (session?.accessToken) {
    config.headers.set('Authorization', `Bearer ${session.accessToken}`);
  } else {
    config.headers.delete('Authorization');
  }
  return config;
});

api.interceptors.response.use((response) => response, async (error) => {
  const request = error.config;
  // 403 — нет прав, refresh не поможет
  if (error.response?.status !== 401 || !request) throw error;
  // Ответ от уже завершённой сессии не меняет текущую
  if (request._sessionVersion !== getSessionVersion()) throw error;
  if (request._retried || !getSession()?.refreshToken) {
    clearSession();
    throw error;
  }

  request._retried = true;
  const version = getSessionVersion();
  try {
    // Если другой запрос уже обновил токены, повторяем без второго refresh
    if (request._accessToken === getSession()?.accessToken) await refreshOnce(version);
    if (version !== getSessionVersion() || !getSession()) throw error;
    return api(request);
  } catch (refreshError) {
    if (version === getSessionVersion()) clearSession();
    throw error;
  }
});

// Текст ошибки из ответа бэкенда (ApiError: { status, error, message, timestamp }).
// Ошибка сети или nginx может прийти без тела — тогда запасное сообщение
export const errorText = (err, fallback) => {
  if (!err?.response) return 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз';
  const data = err.response.data;
  if (typeof data === 'string' && data && !data.trim().startsWith('<')) return data;
  if (data?.message) return data.message;
  if (err.response.status >= 500) return 'Ошибка сервера. Попробуйте позже';
  return fallback;
};

// ===== Вход и выход =====

export const login = async (email, password) => {
  const { data } = await publicApi.post('/auth/login', { email, password });
  setSession(data);
};

// Ответ: { message }. Токены регистрация не выдаёт — после неё нужен вход
export const register = async ({ firstName, lastName, middleName, email, password }) => {
  const { data } = await publicApi.post('/auth/register', {
    firstName,
    lastName,
    middleName: middleName || undefined,
    email,
    password
  });
  return data;
};

// Локальный выход выполняется и при недоступном сервере
export const logout = async () => {
  const refreshToken = getSession()?.refreshToken;
  clearSession();
  if (mock || !refreshToken) return;
  try {
    await publicApi.post('/auth/logout', { refreshToken });
  } catch (err) {
    console.error('Сервер не подтвердил выход:', err);
  }
};

// ===== Профиль =====

export const ROLE_LABELS = {
  USER: 'Статус не подтверждён',
  STUDENT: 'Студент',
  TEACHER: 'Преподаватель',
  ADMIN: 'Администратор'
};

// { id, email, nickname, firstName, lastName, middleName, role, emailConfirmed }.
// role: USER — новый пользователь, STUDENT и TEACHER выдаются после одобрения заявки
export const getProfile = async () => {
  if (mock) return mock.getProfile();
  const { data } = await api.get('/users/me');
  return data;
};

export const isTeacher = (profile) => profile?.role === 'TEACHER';

// Повторное письмо подтверждения почты. Ответ одинаковый для любого адреса
export const resendConfirmation = async (email) => {
  if (mock) return { message: 'Письмо отправлено' };
  const { data } = await publicApi.post('/auth/resend-confirmation', { email });
  return data;
};

// ===== Заявки на статус студента и преподавателя =====

// Свои заявки, новые сверху: [{ id, requestType, status, comment, createdAt, reviewedAt }]
export const getVerificationStatus = async () => {
  if (mock) return mock.getVerificationStatus();
  const { data } = await api.get('/verification/status');
  return data;
};

// Обязательно только fullName; пустые поля не отправляем
export const requestStudentStatus = async (fields) => {
  if (mock) return mock.requestStudentStatus();
  const body = Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== '' && value != null)
  );
  const { data } = await api.post('/verification/student', body);
  return data;
};

// Заявка с документом (pdf, jpg, png, doc до 5 МБ) уходит на почту.
// Content-Type не задаём: boundary для multipart выставит браузер
export const requestTeacherStatus = async ({ fullName, organization, file }) => {
  if (mock) return mock.requestTeacherStatus();
  const form = new FormData();
  form.append('fullName', fullName);
  form.append('organization', organization);
  form.append('file', file);
  const { data } = await api.post('/profile/teacher-request', form);
  return data;
};

// ===== Группы преподавателя (роль TEACHER) =====

// [{ id, name, organization, studentsCount }]
export const getGroups = async () => {
  if (mock) return mock.getGroups();
  const { data } = await api.get('/groups');
  return data;
};

export const createGroup = async (name, organization) => {
  if (mock) return mock.createGroup(name, organization);
  const { data } = await api.post('/groups', { name, organization });
  return data;
};

// { id, name, organization, inviteCode,
//   students: [{ id, lastName, firstName, scores: [обучение, ур.1, ..., ур.10] }] }
export const getGroup = async (id) => {
  if (mock) return mock.getGroup(id);
  const { data } = await api.get(`/groups/${id}`);
  return data;
};

export const updateGroup = async (id, name, organization) => {
  if (mock) return mock.updateGroup(id, name, organization);
  const { data } = await api.put(`/groups/${id}`, { name, organization });
  return data;
};

// studentId — публичный ID пользователя из его личного кабинета
export const addStudentToGroup = async (groupId, studentId) => {
  if (mock) return mock.addStudentToGroup(groupId, studentId);
  const { data } = await api.post(`/groups/${groupId}/students`, { studentId: Number(studentId) });
  return data;
};

export const removeStudentFromGroup = async (groupId, studentId) => {
  if (mock) return mock.removeStudentFromGroup(groupId, studentId);
  const { data } = await api.delete(`/groups/${groupId}/students/${studentId}`);
  return data;
};

// ===== Студент (роль STUDENT) =====

// [{ id, name, organization, teacher: { lastName, firstName, middleName } }]
export const getMyGroups = async () => {
  if (mock) return mock.getMyGroups();
  const { data } = await api.get('/groups/my');
  return data;
};

// Вступление по коду из ссылки-приглашения; ответ — группа с преподавателем
export const joinGroup = async (inviteCode) => {
  if (mock) return mock.joinGroup(inviteCode);
  const { data } = await api.post(`/groups/join/${encodeURIComponent(inviteCode)}`);
  return data;
};

// ===== Оценки =====

// Ровно 11 значений: [обучение, ур.1, ..., ур.10]; null — нет результата, 0 — пройдено на 0
export const getMyScores = async () => {
  if (mock) return mock.getMyScores();
  const { data } = await api.get('/profile/scores');
  return data;
};

// Результат уровня из игры: level и score — целые от 0 до 10.
// Сервер хранит лучший балл и возвращает актуальный массив оценок
export const saveLevelResult = async (level, score) => {
  if (mock) return mock.saveLevelResult(level, score);
  const { data } = await api.post('/profile/scores', { level, score });
  return data;
};
