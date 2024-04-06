<template>
  <div class="schedule">
    <h1>Смены</h1>
    <!-- Кнопки для переключения недель -->
    <div class="navigation-buttons">
      <button class="navigation-button prev-week" @click="prevWeek">&lt;</button>
      <span class="current-week">{{ formatDateHeader(currentWeekDates[0]) }} - {{ formatDateHeader(currentWeekDates[6]) }}</span>
      <button class="navigation-button next-week" @click="nextWeek">&gt;</button>
    </div>
    <!-- Таблица расписания смен -->
    <table>
      <thead>
      <tr>
        <!-- Заголовки дней недели -->
        <th></th>
        <th v-for="(worker, workerIndex) in workers" :key="workerIndex">{{ worker.name }}</th>
      </tr>
      </thead>
      <tbody>
      <!-- Ячейки с датами и сменами -->
      <tr v-for="(day, dayIndex) in currentWeekDates" :key="dayIndex">
        <td>{{ formatDateHeader(day) }} {{ daysOfWeek[dayIndex] }}</td>
        <td v-for="(worker, workerIndex) in workers" :key="workerIndex" :class="{ 'table-shift': isShiftScheduled(worker.id, day) }">
          <div v-if="isShiftScheduled(worker.id, day)">
            <button class="shift-button" :key="`shift-${workerIndex}-${dayIndex}`">
              {{ formatShiftTime(getShiftInfo(worker.id, day).startTime) }} - {{ formatShiftTime(getShiftInfo(worker.id, day).endTime) }}
            </button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from "@/utils/api"
export default {
  data() {
    return {
      currentDate: new Date(), // Текущая дата
      weekStartDate: null, // Начальная дата текущей недели
      weekEndDate: null, // Конечная дата текущей недели
      daysOfWeek: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'], // Дни недели
      workers: [],
      activeWorker: null,
      showAddShiftModal: false,
      loadedWeeks: [],
    };
  },
  computed: {
    // Генерация массива дат текущей недели
    currentWeekDates() {
      const dates = [];
      const currentDate = new Date(this.weekStartDate);
      for (let i = 0; i < 7; i++) {
        const newDate = new Date(currentDate);
        newDate.setUTCDate(newDate.getUTCDate() + i);
        dates.push(newDate.toISOString().split('T')[0]);
      }
      return dates;
    },
    // Форматирование начальной и конечной дат текущей недели
    formattedStartDate() {
      return this.formatDateHeader(this.weekStartDate);
    },
    formattedEndDate() {
      return this.formatDateHeader(this.weekEndDate);
    }
  },
  mounted() {
    this.calculateWeekRange();
    this.fetchWorkers();
    this.loadedWeeks.push(this.formatShortDate(this.weekStartDate));
  },
  methods: {
    async fetchWorkers(){
      try {
        const response = await api.get('api/workers/get');
        this.workers = response.data;
        for (const worker of this.workers){
          worker.shifts = [];
        }
        await this.fetchShiftsForWorkers();
      } catch (error) {
        console.error('Ошибка при загрузке рабочих:', error);
      }
    },
    async fetchShiftsForWorkers() {
      try {
        for (const worker of this.workers) {
          console.log(this.weekStartDate.toISOString() + " " + this.weekEndDate.toISOString())
          const response = await api.get(`api/workers/shifts/by-worker-id?workerId=${worker.id}&startTime=${this.weekStartDate.toISOString()}&endTime=${this.weekEndDate.toISOString()}`);
          worker.shifts.push(...response.data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке смен для работников:', error);
      }
    },
    // Проверка наличия смены у сотрудника в указанный день
    getShiftInfo(workerId, day) {
      const worker = this.workers.find(worker => worker.id === workerId);
      if (!worker || !worker.shifts) return null;
      const formattedDay = this.formatShortDate(day);
      return worker.shifts.find(shift => this.formatShortDate(shift.startTime) === formattedDay);
    },

    // Переключение на предыдущую неделю
    async prevWeek() {
      this.currentDate.setDate(this.currentDate.getUTCDate() - 7);
      this.calculateWeekRange();
      if (!this.loadedWeeks.includes(this.formatShortDate(this.weekStartDate))) {
        console.log("Загружена неделя")// Проверка, были ли данные для текущей недели уже загружены
        await this.fetchShiftsForWorkers(); // Вызов метода при переключении на предыдущую неделю
        this.loadedWeeks.push(this.formatShortDate(this.weekStartDate));
        console.log(this.loadedWeeks)// Добавление текущей даты начала недели в массив загруженных недель
      }
    },
    // Переключение на следующую неделю
    async nextWeek() {
      this.currentDate.setDate(this.currentDate.getUTCDate() + 7);
      this.calculateWeekRange();
      if (!this.loadedWeeks.includes(this.formatShortDate(this.weekStartDate))) {
        console.log("Загружена недея")
        console.log(this.loadedWeeks)// Проверка, были ли данные для текущей недели уже загружены
        await this.fetchShiftsForWorkers(); // Вызов метода при переключении на следующую неделю
        this.loadedWeeks.push(this.formatShortDate(this.weekStartDate));
        console.log(this.loadedWeeks)// Добавление текущей даты начала недели в массив загруженных недель
      }
    },
    // Расчет начальной и конечной дат текущей недели
    calculateWeekRange() {
      const currentWeekDay = this.currentDate.getUTCDay();
      this.weekStartDate = new Date(this.currentDate);
      this.weekStartDate.setUTCDate(this.weekStartDate.getUTCDate() - currentWeekDay + (currentWeekDay === 0 ? -6 : 1));
      this.weekEndDate = new Date(this.weekStartDate);
      this.weekEndDate.setUTCDate(this.weekEndDate.getUTCDate() + 6);
    },
    // Проверка наличия смены у сотрудника в указанный день
    isShiftScheduled(workerId, day) {
      const worker = this.workers.find(worker => worker.id === workerId);
      if (!worker || !worker.shifts) return false;
      const formattedDay = this.formatShortDate(day);
      return !!worker.shifts.find(shift => this.formatShortDate(shift.startTime) === formattedDay);
    },
    // Форматирование даты для отображения
    formatDateHeader(date) {
      const options = { day: '2-digit', month: 'short' };
      return new Date(date).toLocaleDateString('ru-RU', options);
    },
    formatShortDate(date){
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString('ru-RU', options)
    },
    formatShiftTime(date){
      const options = { hour: '2-digit', minute: '2-digit'  };
      return new Date(date).toLocaleTimeString('ru-RU', options);
    },
  }
};
</script>


<style scoped>
.schedule {
  margin-bottom: 100px;
  font-size: 0.7em;
}

.navigation-buttons {
  position: fixed;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 70px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7); /* Темный цвет с прозрачностью */
  border-radius: 20px; /* Закругление краев */
  padding: 10px;
  z-index: 999; /* Устанавливаем высокий уровень z-index */
  backdrop-filter: blur(90px); /* Размытие фона */
}

.navigation-button {
  background-color: transparent;
  border: 2px solid #fff; /* Белый контур */
  border-radius: 50%; /* Круглая форма */
  cursor: pointer;
  padding: 10px;
  color: #fff; /* Белый цвет текста */
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s; /* Плавное изменение цвета при наведении */
}

.navigation-button.prev-week::before {
  content: '\2039'; /* Знак стрелки влево */
}

.navigation-button.next-week::before {
  content: '\203A'; /* Знак стрелки вправо */
}

.navigation-button:hover {
  background-color: #fff; /* Белый цвет при наведении */
  color: #000; /* Черный цвет текста при наведении */
}

.current-week {
  font-weight: bold;
  color: #fff; /* Белый цвет текста */
}

.schedule table {
  width: 100%;
  border-collapse: collapse;
}

.schedule th,
.schedule td {
  border: 1px solid #ccc;
  padding: 2px;
}

.schedule th:first-child,
.schedule td:first-child {
  text-align: left;
}

.schedule span {
  font-weight: bold;
}

.shift-button {
  width: 100%;
  height: 100%;
  background-color: #4ca2ff;
  padding: 10px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.table-shift {
}
</style>