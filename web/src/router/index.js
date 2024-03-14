import { createRouter, createWebHistory } from 'vue-router'
import PkIndexView from '@/views/pk/PkIndexView'
import RecordIndexView from '@/views/record/RecordIndexView'
import RanklistIndexView from '@/views/ranklist/RanklistIndexView'
import UserBotIndexView from '@/views/user/bot/UserBotIndexView'
import NotFound from '@/views/error/NotFound'

// 定义路径：定义某个路径的时候是写一个对象，第一个是定义路径path映射，然后component是路径对应的哪个组件
const routes = [
  // 重定向根目录
  {
    path: "/",
    name: "home",
    redirect: "/pk/",
  },
  {
    // 这里写的是相对路径，是域名后面的路径
    path: "/pk/",
    // 给路径起个名
    name: "pk_index",
    // component是路径对应的哪个组件
    component: PkIndexView,
  },
  {
    path: "/record/",
    name: "record_index",
    component: RecordIndexView,
  },
  {
    path: "/ranklist/",
    name: "ranklist_index",
    component: RanklistIndexView,
  },
  {
    path: "/user/bot/",
    name: "user_bot_index",
    component: UserBotIndexView,
  },
  {
    path: "/404/",
    name: "404",
    component: NotFound,
  },
  // 重定向404
  {
    path: "/:catchAll(.*)",
    redirect: "/404/",
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
