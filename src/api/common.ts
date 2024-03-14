import request from '@/utils/request'

export function registerWebPush(subscription: any) {
  return request({
    url: '/user/push_subscriptions',
    method: 'post',
    data: {
      subscription
    }
  })
}

export function getShortUrl(url: string) {
  return request({
    url: '/other/short_url',
    method: 'get',
    params: {
      url
    }
  })
}
