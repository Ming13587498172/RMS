import request from '@/utils/request'

/**
 * 获取角色列表
 * @returns
 */
export const roles = () => {
  return request({
    method: 'GET',
    url: 'roles'
  })
}

/**
 * 添加角色
 * @param {roleName, roleDesc} param0
 * @returns
 */
export const addRole = ({ roleName, roleDesc }) => {
  return request({
    method: 'POST',
    url: 'roles',
    data: {
      roleName,
      roleDesc
    }
  })
}

/**
 * 删除角色
 * @param {id} param0
 * @returns
 */
export const delRole = ({ id }) => {
  return request({
    method: 'DELETE',
    url: `roles/${id}`
  })
}

/**
 * 编辑角色信息
 * @param {id, roleName, roleDesc} param0
 * @returns
 */
export const editRole = ({ id, roleName, roleDesc }) => {
  return request({
    method: 'PUT',
    url: `roles/${id}`,
    data: {
      roleName,
      roleDesc
    }
  })
}
