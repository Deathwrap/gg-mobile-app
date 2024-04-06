<template>
  <div id="app">
    <template v-if="!isLoggedIn">
      <employee-login @loginSuccess="handleLoginSuccess" />
    </template>
    <template v-else>
      <div class="main-content">
        <router-view />
      </div>
      <BottomNavbar />
    </template>
  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex';
import EmployeeLogin from '@/components/EmployeeLogin.vue';
import BottomNavbar from './components/BottomNavbar.vue';

export default {
  components: {
    EmployeeLogin,
    BottomNavbar
  },
  computed: {
    ...mapState(['isLoggedIn'])
  },
  mounted() {
    // Проверяем наличие accessToken и refreshToken
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    // Если токены присутствуют, перенаправляем пользователя на главную страницу администратора
    if (accessToken && refreshToken) {
      this.isLoggedIn = true;
    }
  },
  methods: {
    ...mapMutations(['setLogin']),
    handleLoginSuccess() {
      console.log("handleLoginSuccess")
      this.setLogin();// Устанавливаем флаг аутентификации в true
    },
  }
};
</script>

<style>
/* Ваши глобальные стили могут быть добавлены здесь */
* {
  font-size: 1.04em;
}

.main-content {
  min-height: calc(100vh - 56px); /* Устанавливаем минимальную высоту, вычитая высоту нижней навигационной панели */
  overflow-y: auto; /* Добавляем прокрутку, если содержимое выходит за пределы высоты */
  padding-bottom: 56px;
}
</style>
