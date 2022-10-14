<template>
  <div class='sub-category'>
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 筛选区 -->
      <SubFilter @filter-change="changeFilter" />
      <!-- 结果区域 -->
      <div class="goods-list">
        <!-- 排序 -->
        <SubSort @sort-change="sortChange" />
        <!-- 列表 -->
        <ul>
          <li v-for="goods in goodsList" :key="goods.i" >
            <GoodsItem :goods="goods" />
          </li>
        </ul>
        <!-- 无限加载组件 -->
        <XtxInfiniteLoading :loading="loading" :finished="finished"   @infinite="getData" />
      </div>
    </div>
  </div>
</template>

<script>
import SubBread from './components/sub-bread'
import SubFilter from './components/sub-filter'
import SubSort from './components/sub-sort'
import GoodsItem from './components/goods-item'
import { findSubCategoryGoods } from '@/api/category'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
export default {
  name: 'SubCategory',
  components: { SubBread, SubFilter, SubSort, GoodsItem },
  setup () {
    const route = useRoute()
    const loading = ref(false)
    const finished = ref(false)
    const goodsList  = ref([])
    // 查询参数
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    const  getData = () => {
     loading.value = true
     // 设置二级分类ID
     reqParams.categoryId = route.params.id
     findSubCategoryGoods(reqParams).then(({ result }) => {
      // 获取事件成功
      if (result.items.length) {
        // 有数据 将数据追加
        goodsList.value.push(...result.items)
        reqParams.page++
      } else {
        finished.value = true
      }
      loading.value = false
     })
    }
    // 在更改了二级分类的时候需要重加载数据
    watch(() => route.params.id, (newVal) => {
      if (newVal && route.path === ('/category/sub/' + newVal)) {
        goodsList.value = []
        reqParams = {
          page: 1,
          pageSize: 20
        }
        finished.value = false 
      }
    })
    // 1. 更改排序组件的筛选数据 重新请求
   const sortChange = (sortParams) => {
    finished.value = false
    // 合并请求参数 保留之前的参数
    reqParams = { ...reqParams, ...sortParams}
    reqParams.page = 1
    goodsList.value = []
   }

   // 2监听筛选区改变
   const changeFilter = (filterParams) => {
      reqParams = { ...reqParams, ...filterParams }
      reqParams.page = 1
      goodsList.value = []
      finished.value = false
    }
    return {getData,loading,finished,goodsList,sortChange,changeFilter }
  }
}
</script>

<style scoped lang='less'>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
