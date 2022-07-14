import request from '@/utils/request'

export const menus = () => {
  return request({
    method: 'GET',
    url: 'menus'
  })
}
