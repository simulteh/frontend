import { publicApi } from './api';

class AuthService {
  // Запрос на сброс пароля. Ответ одинаковый, есть такой адрес или нет
  async requestPasswordReset(email) {
    const response = await publicApi.post('/auth/forgot-password', { email });
    return response.data;
  }

  // Новый пароль по токену из письма
  async resetPassword(token, newPassword) {
    const response = await publicApi.post('/auth/reset-password', { token, newPassword });
    return response.data;
  }

  // Подтверждение email по токену из письма
  async confirmEmail(token) {
    const response = await publicApi.post('/auth/confirm-email', { token });
    return response.data;
  }

  // Повторная отправка письма подтверждения
  async resendConfirmation(email) {
    const response = await publicApi.post('/auth/resend-confirmation', { email });
    return response.data;
  }
}

// Создаем экземпляр и присваиваем переменной
const authService = new AuthService();

// Экспортируем переменную
export default authService;
