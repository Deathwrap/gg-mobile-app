import { createRouter, createWebHistory } from 'vue-router'
import Shifts from '@/components/ShiftsComponent.vue'
//import Jobs from '../views/Jobs.vue'
import Profile from '@/components/ProfileComponent.vue'

const routes = [
    {
        path: '/shifts',
        name: 'Shifts',
        component: Shifts
    },
    // {
    //     path: '/jobs',
    //     name: 'Jobs',
    //     component: Jobs
    // },
     {
        path: '/profile',
        name: 'Profile',
        component: Profile
     }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
