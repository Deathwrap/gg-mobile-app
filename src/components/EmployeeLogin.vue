<template>
  <div class="login-container">
    <h2>Вход для работника</h2>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="username">Логин:</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Войти</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(`http://192.168.1.146:5198/api/workers/auth/sign_in`,
            {
              login:this.username,
              password: this.password,
            });
        const {name, accessToken, refreshToken, position } = response.data; // Предположим, что сервер возвращает токены в таком формате

        localStorage.setItem('userName', name);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('position', position)
        this.$emit('loginSuccess');
        await this.$router.push('/profile');
      } catch (error) {
        console.error('Ошибка при аутентификации:', error);
        window.plugins.toast.show(`Ошибка при аутентификации: ${error.toString()}`, "short", "bottom")
        // Обработка ошибок аутентификации
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center; /* Размещаем элементы по центру */
}

.login-form {
  width: 100%; /* Чтобы форма занимала всю доступную ширину */
}

.form-group {
  margin-bottom: 20px;
  text-align: left; /* Выравниваем текст слева */
}

label {
  display: block;
  margin-bottom: 5px; /* Увеличиваем размер текста */
}

input {
  width: 100%;
  padding: 15px 0px 15px; /* Увеличиваем высоту полей */
  border: 1px solid #ccc;
  border-radius: 10px;
}

button {
  padding: 15px 30px; /* Увеличиваем размер кнопок */
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
</style>
