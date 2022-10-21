// 用户相关的接口

import request  from "@/utils/request";

/**
 * 
 * @param {String} account 账号
 * @param {String} password 密码
 * @returns promise
 */
export const userAccountLogin = ({ account, password }) => {
  return request('/login', 'post', { account, password })
}

/**
 * 短信登录
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns Promise
 */
 export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'post', { mobile, code })
}

/**
 * 获取短信登录验证码
 * @param {String} mobile - 手机号
 * @returns Promise
 */
export const userMobileLoginMsg= (mobile) => {
  return request('/login/code', 'get', { mobile })
}

