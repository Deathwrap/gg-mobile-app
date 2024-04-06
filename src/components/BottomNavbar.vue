<template>
  <nav class="bottom-navbar">
    <router-link to="/shifts" class="nav-link" :class="{ active: isActive('/shifts') }">
      <font-awesome-icon icon="clock" :size="iconSize" />
    </router-link>
    <router-link to="/jobs" class="nav-link" :class="{ active: isActive('/jobs') }">
      <font-awesome-icon icon="toolbox" :size="iconSize" />
    </router-link>
    <router-link to="/profile" class="nav-link" :class="{ active: isActive('/profile') }">
      <font-awesome-icon icon="user-circle" :size="iconSize" />
    </router-link>
  </nav>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faClock, faToolbox, faUserCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faClock, faToolbox, faUserCircle)

export default {
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      iconSize: '2x' // Устанавливаем размер иконок
    }
  },
  methods: {
    isActive(route) {
      return this.$router.currentRoute.value.path === route;
    }
  }
}
</script>

<style scoped>
.bottom-navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  background-color: #f8f9fa; /* Цвет фона можно изменить по вашему усмотрению */
  padding: 10px 0;
  z-index: 999; /* Устанавливаем высокий уровень z-index */
  border-top: 1px solid #ccc; /* Граница сверху */
}

.nav-link {
  text-decoration: none;
  color: #333; /* Цвет текста можно изменить по вашему усмотрению */
}

.nav-link.active {
  color: #007bff; /* Цвет активного текста можно изменить по вашему усмотрению */
}
</style>
