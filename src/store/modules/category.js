// 分类模块
import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category.js'

export default {
  namespaced: true,
  state: () => {
    return {
      // 分类信息集合 依赖topCategory重新设置 保证初始化就拿到数据
      list: topCategory.map(item => ({ name:item }))
    }
  },
  //修改分类函数
  mutations: {
    //payload 所有的分类集合
    setList (state, payload) {
      state.list = payload
    },
    show(state, id) {
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = true
    },
    hide(state, id) {
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = false
    }
  },
  //获取分类函数
  actions: {
    async getList ({ commit }) {
      // 获取分类数据
      const data = await findAllCategory()
      //给一级分类加上一个控制二级分类显示隐藏的数据open
      data.result.forEach(top => {
        top.open = false 
      })
      // 修改分类数据
      // console.log(data);
      commit('setList', data.result)
    }
  }

}
