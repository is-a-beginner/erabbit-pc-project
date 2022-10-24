import {getNewCartGoods, insertCart,mergeLocalCart,findCartList, deleteCart,updateCart,checkAllCart} from '@/api/cart.js'

// 购物车状态
export default {
  namespaced: true,
  state: () => {
    return {
      // 购物车商品列表
      list: []
    }
  },
  mutations: {
    insertCart (state,payload) {
       // 约定加入购物车字段必须和后端保持一致
       // 字段有 id skuId name picture price nowPrice count attrsText selected stock isEffective
       // 插入规则：
       // 1. 先找下是否有相同商品
       // 2. 如果有相同商品 查询数量 累加到payload上 保存到最新的位置 删除原来的商品
       // 3. 如果没有相同商品，保存到最新的位置
       const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
       if (sameIndex > -1) {
        // 如果找到相同的商品
        const count = state.list[sameIndex].count
        payload.count += count
        // 删除原来的商品
        state.list.splice(sameIndex, 1)
       }
       // 追加新的商品
       state.list.unshift(payload)
    },
    // 修改购物车商品
     updateCart (state, goods) {
      // goods中字段有可能不完整，goods有的信息才去修改。
      // 1. goods中必需又skuId，才能找到对应的商品信息
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== null && goods[key] !== undefined && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除购物车商品
    deleteCart(state,skuId) {
      const index = state.list.findIndex(goods => goods.skuId === skuId) 
        state.list.splice(index,1)
    },
      // 设置购物车列表
      setCartList (state, list) {
        state.list = list
     },
  },
  actions: {
     // 合并本地购物车
     async mergeLocalCart (ctx) {
      // 存储token后调用合并API接口函数进行购物合并
      const cartList = ctx.getters.validList.map(({ skuId, selected, count }) => {
        return { skuId, selected, count }
      })
      await mergeLocalCart(cartList)
      // 合并成功将本地购物车删除
      ctx.commit('setCartList', [])
    },

    // 修改规格
    updataCartSku (ctx,{ oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          deleteCart([oldSkuId]).then(() => {
            return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
          }).then(() => {
            return findCartList()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地
          // 1. 找出旧的商品信息
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId )
          // 2. 删除旧的商品信息
          ctx.commit('deleteCart', oldSkuId)
          // 3. 根据新的sku信息和旧的sku信息 合并成一条新的购物车商品数据
          const { skuId, price: nowPrice, inventory: stock, specsText: attrsText } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, stock, attrsText }
          // 4. 增添新的商品
          ctx.commit('insertCart',newGoods )
          resolve()
        }
      })
    },

    // 做有效商品的全选&反选
    checkAllCart (ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          const ids = ctx.getters.validList.map(item => item.skuId)
          checkAllCart({ selected, ids }).then(() => {
            return findCartList()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地
          // 1. 获取有效的商品列表，遍历的去调用修改mutations即可
          ctx.getters.validList.forEach(item => {
            ctx.commit('updateCart', { skuId: item.skuId, selected })
          })
          resolve()
        }
      })
    },

    // 加入购物车
    insertCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          insertCart({ skuId: payload.skuId, count: payload.count  }).then(() => {
            return findCartList()
          }).then((data => {
            ctx.commit('setCartList',data.result)
            resolve()
          }))
        } else {
          // 未登录 本地登录
          ctx.commit('insertCart', payload)
          resolve()
        }
      })
    },

    // 获取购物车列表
    findCartList (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
          findCartList().then(data => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地
          // Promise.all() 可以并列发送多个请求，等所有请求成功，调用then
          // Promise.race() 可以并列发送多个请求，等最快的请求成功，调用then
          // 传参事promise数组
          const promiseArr = ctx.state.list.map(goods => {
            // 返回接口函数的调用
            return getNewCartGoods(goods.skuId)
          })
          Promise.all(promiseArr).then(dataArr => {
            dataArr.forEach((data, i) => {
              ctx.commit('updateCart', { skuId: ctx.state.list[i].skuId, ...data.result })
            })
            resolve()
          }).catch(e => {
            reject(e)
          })
        }
      })
    },

    // 修改购物车(选中状态，数量)
    updateCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
          updateCart(payload).then(() => {
            return findCartList()
          }).then(data => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地
          ctx.commit('updateCart', payload)
          resolve()
        }
      })
    },
    
    // 删除购物车商品
    deleteCart (ctx, skuId) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录
          deleteCart([skuId]).then(() => {
            return findCartList()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地
          ctx.commit('deleteCart',skuId)
          resolve()
        }
      })
    },

    // 批量删除选中商品
    batchDeleteCart(ctx, isClear) {
      return new Promise((reslove, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录
        const ids = ctx.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
        deleteCart(ids).then(() => {
          return findCartList()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地
          // 1. 获取选中商品列表，进行遍历调用deleteCart mutataions函数
          ctx.getters[isClear? 'invalidList' : 'selectedList'].forEach(item => {
            ctx.commit('deleteCart', item.skuId)
      })
       reslove()
      }
     })
    },
  },
  

  getters: {
    // 有效商品列表
    validList (state) {
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
    },
    // 有效商品件数累加
    validTotal (state, getters) {
      //累加
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      return getters.validList.reduce((p, c) => p + Math.round(c.count * 100) * c.nowPrice, 0) / 100

    },
    // 无效商品列表
    invalidList (state) {
      return state.list.filter(goods =>goods.stock < 0 && !goods.isEffectiveods )
    },
    // 已选商品列表
    selectedList (state, getters) {
      return getters.validList.filter(goods => goods.selected)
    },
    // 已选商品总件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 已选商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + Math.round(c.count * 100) * c.nowPrice, 0) / 100

    },
    // 是否全选
    isCheckAll (state,getters) {
      return getters.validList.length === getters.selectedList.length && getters.selectedList.length !== 0
    },
  },
}
