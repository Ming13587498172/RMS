import request from '@/utils/request'

/**
 * 获取商品列表 / 根据query搜索条件 获取部分数据
 * query->搜索条件
 * @param {query, pagenum, pagesize} param0
 * @returns
 */
export const goods = ({ query, pagenum, pagesize }) => {
  return request({
    method: 'GET',
    url: '/goods',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}

/**
 *  根据id删除商品
 * @param {id} param0
 * @returns
 */
export const delGoods = ({ id }) => {
  return request({
    method: 'DELETE',
    url: `/goods/${id}`
  })
}

export const addGoods = ({ goods_name, goods_cat, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs }) => {
  return request({
    method: 'POST',
    url: '/goods',
    data: {
      goods_name,
      goods_cat,
      goods_price,
      goods_number,
      goods_weight,
      goods_introduce,
      pics,
      attrs
    }
  })
}
