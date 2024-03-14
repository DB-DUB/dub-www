import { MockMethod } from 'vite-plugin-mock'
import { successResult, errorResult, requestParams, getRequestToken } from '@/utils/result'
import { TokenPrefix } from '@/utils/auth'

export function createFakeUserList() {
  return [
    {
      id: 'Rj3gBGZukdoYYM5M67FI',
      account: 'test',
      token: '3f251748e00e6b320950be7989c5ded91f6ab676',
      user: {
        id: 'Rj3gBGZukdoYYM5M67FI',
        nickname: 'Test Male',
        avatar: '',
        address: '',
        lol: '0',
        dub: '0'
      },
      user_physical: {
        physical: 85,
        physical_max: 95
      }
    },
    {
      id: 'Rj3gBGZukdoYYM5M67FY',
      account: 'test2',
      token: 'c34677166da36563b7174f15ca918adc200a85be',
      user: {
        id: 'Rj3gBGZukdoYYM5M67FY',
        nickname: 'Test Female',
        avatar: '',
        address: '6busZ6NRA4ng6s1jbkkQjNbL62z3M3sKrFrAfMsNpL63',
        lol: '630250.13',
        dub: '580.63'
      },
      user_physical: {
        physical: 90,
        physical_max: 98
      }
    }
  ]
}
export default [
  {
    url: '/api/user/login',
    timeout: 200,
    method: 'post',
    response: (request: requestParams) => {
      const checkUser = createFakeUserList().find(item => item.account === 'test')
      if (!checkUser) {
        return errorResult('Not Found User')
      }
      return successResult({ token: checkUser.token, id: checkUser.id })
    }
  },
  {
    url: '/api/user/logout',
    timeout: 200,
    method: 'post',
    response: (request: requestParams) => {
      console.dir(request)
      const token = getRequestToken(request)
      if (!token) return errorResult('Invalid token')
      const checkUser = createFakeUserList().find(item => `${TokenPrefix}${item.token}` === token)
      if (!checkUser) {
        return errorResult('Invalid token')
      }
      return successResult('Invalid token')
    }
  },
  {
    url: '/api/user/info',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      if (!token) return errorResult('Invalid token')
      const checkUser = createFakeUserList().find(item => `${TokenPrefix}${item.token}` === token)
      if (!checkUser) {
        return errorResult('Not Found User')
      }
      return successResult(checkUser)
    }
  },
  {
    url: '/api/test',
    method: 'post',
    rawResponse: async (req, res) => {
      let reqbody = ''
      await new Promise(resolve => {
        req.on('data', chunk => {
          reqbody += chunk
        })
        req.on('end', () => resolve(undefined))
      })
      res.setHeader('Content-Type', 'text/plain')
      res.statusCode = 404
      res.end(`hello, ${reqbody}`)
    }
  },
  {
    url: '/api/user/push_subscriptions',
    method: 'post',
    response: (request: requestParams) => {
      return successResult({})
    }
  },
  {
    url: '/api/other/short_url',
    method: 'get',
    response: (request: requestParams) => {
      console.log('request', request.query.url)
      return successResult({
        short_url: request.query.url
      })
    }
  }
] as MockMethod[]
