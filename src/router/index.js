import { createRouter, createWebHashHistory } from 'vue-router'
import homeView from '../views/home-view.vue'
import loginView from '../views/login-view.vue'
import workspaceView from '../views/workspace-view.vue'
import boardView from '../views/board-view.vue'
import cardEdit from '../components/board/card-edit.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: homeView
    },
    {
      path: '/login',
      name: 'login',
      component: loginView
    },
    {
      path: '/workspace',
      name: 'workspace',
      component: workspaceView
    },
    {
      path: '/board/:boardId',
      name: 'board',
      component: boardView,
      children: [
        {
          path: 'edit/:cardId',
          component: cardEdit
        }
      ]
    },
  ]
})

export default router
