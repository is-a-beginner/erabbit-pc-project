<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggleDialog" :class="{active}">
      <span v-if="!fullLocation" class="placeholder">{{placeholder}}</span>
      <span v-else class="value">{{ fullLocation }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="active">
      <div v-if="loading" class="loading"> </div>
        <template v-else>
            <span class="ellipsis" @click="changeItem(item)" v-for="item in currList" :key="item.code">{{ item.name }}</span>
        </template>
    </div>
  </div>
</template>

<script>
import { computed, ref,reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'

export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type:String,
      default:''
    },
    placeholder: {
      type: String,
      default: '请选择配送地址'
    }
  },
  setup (props,{emit}) {
    // 控制展开收起,默认收起 
    const active = ref(false)

    // 所有省市区数据
    const allCityData = ref([])
    // 正在加载
    const loading = ref(false)

    const openDialog = () => {
      loading.value = true
      active.value = true
      // 获取数据
      getCityData().then(data => {
        allCityData.value = data
        loading.value = false
      })
      // 清空之前选择
      for (const key in changeResult) {
        changeResult[key] = ''
      }
    }
    const closeDialog = () => {
      active.value = false
    }
    // 切换展开收起
    const toggleDialog = () => {
      if (active.value) closeDialog()
      else openDialog()
    }
    // 点击其他位置隐藏
    const target = ref(null)
    onClickOutside(target, () => {
      closeDialog()
    })

    // 实现计算属性 获取当前显示得地区数组
    const currList = computed(() => {
      // 默认省一级
      let list = allCityData.value
      // 市一级
      if (changeResult.provinceCode && changeResult.provinceName) {
        list = list.find(p => p.code === changeResult.provinceCode).areaList
      }
      // 县区一级
      if (changeResult.cityCode && changeResult.cityName) {
        list = list.find(c => c.code === changeResult.cityCode).areaList
      }
      return list
    })

    // 定义选择的 省市区 数据
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''  
    })
	
    // 点击按钮记录当前的数据
    const changeItem = (item) => {
      // 省份
      if (item.level === 0) {
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      // 市
      if (item.level === 1) {
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }
      // 地区
      if (item.level === 2) {
        changeResult.countyCode = item.code
        changeResult.countyName = item.name

        // 完整地区名
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`

        // 这是最后一级, 选完了,关闭对话框，通知父组件数据
        closeDialog()
        emit('change', changeResult)
      }
    }


    return { active, toggleDialog, target , loading, currList, changeItem}
  }
}
// 获取省市区数据
const getCityData = () => {
  
// 1. 数据在哪里？https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
// 2. 何时获取？打开城市列表的时候，做个内存中缓存
// 3. 怎么使用数据？定义计算属性，根据点击的省份城市展示
   return new Promise((resolve, reject) => {
    // 约定： 数据存储在window上的cityData字段
    if (window.cityData) {
      // 有缓存得情况
      resolve(window.cityData)
    } else {
       // 无缓存得情况 调接口拿数据
       const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
       axios.get(url).then(res => {
        // 缓存
        window.cityData = res.data
         resolve(res.data)
       })
    }
   })
}
</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;  
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>

