<template>
  <div class="profile-container">
    <h1 class="profile-title">Профиль</h1>
    <div class="profile-info">
      <div><strong>ФИО:</strong> {{ userName }}</div>
      <div><strong>Должность:</strong> {{ position }}</div>
      <div v-if="workerSkills.length > 0">
        <strong>Навыки:</strong>
        <ul class="skills-list">
          <li v-for="skill in workerSkills" :key="skill.id" class="skill-item">
            {{ getCategoryName(skill.categoryId) }}
          </li>
        </ul>
      </div>
    </div>
    <button @click="logout" class="logout-button">Выйти</button>
  </div>
</template>

<script>
import api from "@/utils/api";
import {mapMutations} from "vuex";


export default {
  data() {
    return {
      userName: localStorage.getItem('userName') || 'Гость',
      workerSkills: [], // Добавляем свойство для хранения навыков рабочего
      categories: [], // Добавляем свойство для хранения категорий навыков
      position: ''
    };
  },
  async created() {
    // Временно загружаем данные о должности и навыках из локального хранилища
    // Замените это на запросы к бэкэнду для получения реальных данных
    this.position = localStorage.getItem('position') || 'Не определено';
    await this.fetchSkills();
    await this.fetchCategories();
  },
  methods: {
    ...mapMutations(['setLogout']), // Используем метод login из хранилища Vuex
    async fetchSkills() {
      try {
        const response = await api.get(`/api/workers/skills`);
        this.workerSkills = response.data;
      } catch (error) {
        console.error('Ошибка при получении навыков рабочего:', error);
      }
    },
    async fetchCategories() {
      try {
        const response = await api.get(`/api/services/categories`);
        this.categories = response.data;
      } catch (error) {
        console.error('Ошибка при получении категорий навыков:', error);
      }
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId);
      return category ? category.name : '';
    },
    logout() {
      localStorage.removeItem('userName');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('position')
      this.setLogout();

      // Дополнительные действия при выходе пользователя, например, очистка localStorage или перенаправление на страницу входа
      // localStorage.removeItem('userName');
      // localStorage.removeItem('position');
      // localStorage.removeItem('skills');
      // this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.profile-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.profile-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
}

.profile-info {
  margin-bottom: 20px;
}

.skills-list {
  list-style-type: none;
  padding: 0;
}

.skill-item {
  margin-bottom: 5px;
}

.logout-button {
  display: block;
  width: 100%;
  padding: 8px 16px; /* Уменьшаем размер кнопки */
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #0056b3;
}
</style>
