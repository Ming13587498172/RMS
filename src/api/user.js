import request from '@/utils/request'

/**
 * 登录
 * @param {username, password} param0
 * @returns
 */
export const login = ({ username, password }) => {
  return request({
    method: 'POST',
    url: 'login',
    data: {
      username,
      password
    }
  })
}

/**
 * 用户数据列表
 * @returns
 */
export const list = ({ pagenum, pagesize }) => {
  return request({
    method: 'GET',
    url: 'users',
    params: {
      pagenum,
      pagesize
    }
  })
}

/**
 * 修改用户状态
 * @param {uId,type} param0
 * @returns
 */
export const state = ({ uId, type }) => {
  return request({
    method: 'PUT',
    url: `users/${uId}/state/${type}`
  })
}

/**
 * 根据条件查询用户数据列表
 * @param {query, pagenum, pagesize} param0
 * @returns
 */
export const search = ({ query, pagenum, pagesize }) => {
  return request({
    method: 'GET',
    url: 'users',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}

/**
 * 添加用户
 * @param {username, password, email, mobile} param0
 * @returns
 */
export const add = ({ username, password, email, mobile }) => {
  return request({
    method: 'POST',
    url: 'users',
    data: {
      username,
      password,
      email,
      mobile
    }
  })
}

/**
 * 编辑用户信息
 * @param {id, email, mobile} param0
 * @returns
 */
export const edit = ({ id, email, mobile }) => {
  return request({
    method: 'PUT',
    url: `users/${id}`,
    data: {
      email,
      mobile
    }
  })
}

/**
 * 删除单个用户
 * @param {id} param0
 * @returns
 */
export const del = ({ id }) => {
  return request({
    method: 'DELETE',
    url: `users/${id}`
  })
}

/**
 * 分配角色
 * @param {id, rid} param0
 * @returns
 */
export const set = ({ id, rid }) => {
  return request({
    method: 'PUT',
    url: `users/${id}/role`,
    data: {
      rid
    }
  })
}
