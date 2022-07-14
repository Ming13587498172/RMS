import request from '@/utils/request'

/**
 *  获取分类列表
 * @returns
 */
export const categories = () => {
  return request({
    method: 'GET',
    url: '/categories'
  })
}

/**
 * 获取参数列表
 * @param {id, sel} param0
 * @returns
 */
export const can = ({ id, sel }) => {
  return request({
    method: 'GET',
    url: `/categories/${id}/attributes`,
    params: {
      sel
    }
  })
}

/**
 * 获取属性列表
 * @param {id, sel} param0
 * @returns
 */
export const shu = ({ id, sel }) => {
  return request({
    method: 'GET',
    url: `/categories/${id}/attributes`,
    params: {
      sel
    }
  })
}

/**
 * 上传图片
 * @param {file} param0
 * @returns
 */
export const upload = ({ file }) => {
  return request({
    method: 'POST',
    url: 'http://liufusong.top:8888/api/private/v1/upload',
    params: { file }
  })
}

/**
 * 添加
 * @param {id, attr_name, attr_sel, attr_vals} param0
 * @returns
 */
export const add = ({ id, attr_name, attr_sel, attr_vals }) => {
  return request({
    method: 'POST',
    url: `/categories/${id}/attributes`,
    data: {
      attr_name,
      attr_sel,
      attr_vals
    }
  })
}

/**
 * 编辑
 * @param {id, attr_name, attr_sel} param0
 * @returns
 */
export const edit = ({ id, attr_name, attr_sel }) => {
  return request({
    method: 'PUT',
    url: `categories/1998/attributes/${id}`,
    data: {
      attr_name,
      attr_sel
    }
  })
}

/**
 * 删除
 * @param {id, attrid} param0
 * @returns
 */
export const del = ({ id, attrid }) => {
  return request({
    method: 'DELETE',
    url: `categories/${id}/attributes/${attrid}`
  })
}

/**
 * 获取分类列表
 * @param {type, pagenum, pagesize} param0
 * @returns
 */
export const getFen = ({ type, pagenum, pagesize }) => {
  return request({
    method: 'GET',
    url: 'categories',
    params: {
      type,
      pagenum,
      pagesize
    }
  })
}

/**
 * 添加分类
 * @param {cat_pid, cat_name, cat_level} param0
 * @returns
 */
export const addFen = ({ cat_pid, cat_name, cat_level }) => {
  return request({
    method: 'POST',
    url: 'categories',
    data: {
      cat_pid,
      cat_name,
      cat_level
    }
  })
}

/**
 * 删除分类
 * @param {id} id
 * @returns
 */
export const delFen = (id) => {
  return request({
    method: 'DELETE',
    url: `/categories/${id}`
  })
}
