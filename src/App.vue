<template>
  <div class="container">
    App <button @click="fn">测试request工具函数</button>
  </div>
</template>

<script>
import request from './utils/request'
export default {
  name: 'App',
  setup () {
    const fn = () => {
      request('/member/profile', 'get', { a : 10 })
    }
    return { fn }
  }
}
</script>
