<template>
  <div class='xtx-carousel'  @mouseenter="stop()" @mouseleave="star()">
    <!-- 轮播图图片容器 -->
    <ul class="carousel-body">
      <li class="carousel-item " v-for="(item,i) in sliders" :key="i" :class="{fade:index===i}">
        <!-- 图片 -->
        <RouterLink v-if="item.hrefUrl" :to="item.hrefUrl">
          <img :src="item.imgUrl" alt="">
        </RouterLink>
        <!-- 商品列表 -->
        <div v-else class="slider">
          <RouterLink v-for="goods in item" :key="goods.id" :to="`/product/${goods.id}`">
            <img :src="goods.picture" alt="">
            <p class="name ellipsis">{{goods.name}}</p>
            <p class="price">&yen;{{goods.price}}</p>
         </RouterLink>
        </div>
      </li>
    </ul>
    <!-- 上一张 -->
    <a @click="toggle(-1)" href="javascript:;" class="carousel-btn prev"><i class="iconfont icon-angle-left"></i></a>
    <!-- 下一张 -->
    <a @click="toggle(1)" href="javascript:;" class="carousel-btn next"><i class="iconfont icon-angle-right"></i></a>
    <!-- 指示器 -->
    <div class="carousel-indicator">
      <span v-for="(item,i) in sliders" :key="i" :class="{active:index===i}"></span>
    </div>
  </div>
</template>

<script>
import { onUnmounted, ref, watch } from 'vue'

export default {
  name: 'XtxCarousel',
  //轮播图数据
  props: {
   sliders: {
      type: Array,
      default: () => []
    },
      //是否自动播放
  autoPlay: {
    type:  Boolean,
    default: false
  },
  //间隔时长
  duration: {
    type: Number,
    default: 3000
  },
  },
  setup (props) {
    // 控制显示图片的索引
    const index = ref(0)
    // 1.自动轮播图的逻辑
    let timer = null
    const autoPlayFn = () => {
      clearInterval(timer)
      //自动播放
      timer = setInterval(() => {
        index.value++
        // 循环播放 播放到最后一张图的时候返回到第一张图片
        if (index.value >= props.sliders.length) {
          index.value = 0
        }
      }, props.duration);
    }
    // 需要监听sliders数据变化 判断如果有数据且autoplay是true
    watch(() => props.sliders, (newVal) => {
      if (newVal.length && props.autoPlay) {
        index.value = 0
        autoPlayFn()
      }
    },{immediate:true})

    // 2 鼠标进入暂停 鼠标离开自动播放
    const stop = () => {
      if (timer) clearInterval(timer)
    }

    const star = () => {
      if(props.sliders.length && props.autoPlay) {
        autoPlayFn()
      }
    }

      // 3.上一张下一张
      const toggle = (step) => {
        // 将要改变的索引
      const newIndex = index.value + step
      // 点击右边按钮 下一张图片的索引超出图片数量 返回到第一张图片
      if (newIndex >= props.sliders.length) {
        index.value = 0
        return
      }
      // 点击左边按钮 上一张图片的索引是-1 返回到最后一张图片
      if (newIndex < 0) {
        index.value = props.sliders.length - 1
        return
      }
      // 正常情况
      index.value = newIndex
    }

    // 4 组件卸载 清除定时器
    onUnmounted(() => {
      clearInterval(timer)
    })


    return { index , stop, star, toggle }
  }
}
</script>
<style scoped lang="less">
// 轮播商品
.slider {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;
  > a {
    width: 240px;
    text-align: center;
    img {
      padding: 20px;
      width: 230px!important;
      height: 230px!important;
    }
    .name {
      font-size: 16px;
      color: #666;
      padding: 0 40px;
    }
    .price {
      font-size: 16px;
      color: @priceColor;
      margin-top: 15px;
    }
  }
}


.xtx-carousel{
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel{
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0,0,0,0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background:  #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0,0,0,.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev{
        left: 20px;
      }
      &.next{
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>

