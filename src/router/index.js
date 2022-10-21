import { createRouter, createWebHashHistory } from 'vue-router'

const Layout = () => import('@/views/Layout.vue')
const Home = () => import('@/views/home')
const TopCategory = () => import('@/views/category/')
const SubCategory = () => import('@/views/category/sub.vue')
const Goods = () => import('@/views/goods/index')
const Login = () => import('@/views/login/index')


const routes = [
  // 一级路由布局容器
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory },
      { path: '/product/:id', component: Goods },
    ]
  },
  { path: '/login', component:Login}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 每次切换路由时滚动到页面顶部
  scrollBehavior() {
    return { left:0, top:0 } 
  }
})

export default router
