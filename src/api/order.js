import request from '@/utils/request'

/**
 * 获取结算信息
 */
 export const createOrder = () => {
  return request('/member/order/pre', 'get')
}

/**
 * 添加收货地址信息
 * @param {Object} address - 地址对象
 */
 export const addAddress = (address) => {
  return request('/member/address', 'post', address)
}

/**
 * 编辑收货地址信息
 * @param {Object} form - 地址对象
 */
 export const editAddress = (form) => {
  return request(`/member/address${form.id}`, 'put', form)
}

/**
 * 提交订单
 * @param {Object} parms - 订单信息对象
 */
 export const submitOrder = (parms) => {
  return request('/member/order', 'post', parms)
}

/**
 * 获取订单详情
 * @param {String} id - 订单ID
 */
 export const findOrder = (id) => {
  return request('/member/order/' + id, 'get')
}


