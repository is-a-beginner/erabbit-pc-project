import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'

const Layout = () => import('@/views/Layout.vue')
const Home = () => import('@/views/home')
const TopCategory = () => import('@/views/category/')
const SubCategory = () => import('@/views/category/sub.vue')
const Goods = () => import('@/views/goods/index')
const Cart = () => import('@/views/cart/index')


const Login = () => import('@/views/login/index')
const PayCheckout = () => import('@/views/member/pay/checkout')
const PayIndex = () => import('@/views/member/pay/index')




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
      { path: '/cart', component: Cart },
      { path: '/member/checkout', component: PayCheckout},
      { path: '/member/pay', component: PayIndex }
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

// 前置导航守卫
router.beforeEach((to, from, next) => {
  //  地址是以 /member开头且未登录  需要登录得路由
  const {profile} = store.state.user
  if (!profile.token && to.path.startsWith('/member')) {
    return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
  }
  next()
})

export default router
