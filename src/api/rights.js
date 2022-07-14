import request from '@/utils/request'

/**
 * 获取权限列表   type-> list/tree
 * @param {type} param0
 * @returns
 */
export const rights = ({ type }) => {
  return request({
    method: 'GET',
    url: `rights/${type}`
  })
}

/**
 * 分配权限
 * @param {roleId, rids} param0
 * @returns
 */
export const setRights = ({ roleId, rids }) => {
  return request({
    method: 'POST',
    url: `roles/${roleId}/rights`,
    data: {
      rids
    }
  })
}

/**
 * 获取权限列表 type-> list
 * @param {type} param0
 * @returns
 */
export const rightList = ({ type }) => {
  return request({
    method: 'GET',
    url: `rights/${type}`
  })
}
