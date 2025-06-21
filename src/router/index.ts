import { createRouter, createWebHistory } from 'vue-router'
import InstructoresView from '@/views/InstructoresView.vue'
import InstructoresInactivosView from '@/views/InstructoresInactivosView.vue'

const routes = [
  {
    path: '/',
    name: 'instructores',
    component: InstructoresView,
  },
  { path: '/especialistas-inactivos',
    name: 'instructores-inactivos',
    component: InstructoresInactivosView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
