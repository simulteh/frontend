import axios from 'axios';

const API_URL = "http://212.67.12.82:8080";

class AuthService {
  // Запрос на сброс пароля
  async requestPasswordReset(email) {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, {
      email
    });
    return response.data;
  }

  // Сброс пароля с токеном
  async resetPassword(token, newPassword) {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      token,
      newPassword
    });
    return response.data;
  }

  // Подтверждение email
  async confirmEmail(token) {
    const response = await axios.post(`${API_URL}/auth/confirm-email`, {
      token
    });
    return response.data;
  }

  // Повторная отправка подтверждения email
  async resendConfirmation(email) {
    const response = await axios.post(`${API_URL}/auth/resend-confirmation`, {
      email
    });
    return response.data;
  }
}

// Создаем экземпляр и присваиваем переменной
const authService = new AuthService();

// Экспортируем переменную
export default authService;