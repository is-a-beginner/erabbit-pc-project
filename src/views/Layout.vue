<template>
  <!-- 顶部通栏 -->
  <AppTopNav></AppTopNav>

  <!-- 头部通栏 -->
  <AppHeader>
  </AppHeader>

   <!-- 吸顶头部 -->
   <AppHeaderSticky></AppHeaderSticky>

  <!-- 内容容器 -->
  <div class="main">
    <!-- 二级路由 -->
    <router-view></router-view>
  </div>

  <!-- 底部通栏 -->
  <AppFooter></AppFooter>
</template>

<script>
  import AppTopNav from '@/components/app-topnav.vue'
  import AppHeader from '@/components/app-header.vue'
  import AppFooter from '@/components/app-footer.vue'
  import AppHeaderSticky from '@/components/app-header-sticky.vue'
  import { useStore } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppTopNav,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },
  setup () {
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style lang="less" scoped>

</style>
