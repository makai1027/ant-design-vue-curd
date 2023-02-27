import type { MockMethod } from 'vite-plugin-mock'
import { resultSuccess } from '../_util'

const demoList = (keyword = '', count = 20) => {
  const result = {
    list: [] as any[],
  }
  for (let index = 0; index < count; index++) {
    result.list.push({
      name: `${keyword ?? ''}选项${index}`,
      id: `${index}`,
    })
  }
  return result
}

export default [
  {
    url: '/basic-api/select/getDemoOptions',
    timeout: 1000,
    method: 'get',
    response: ({ query }: Recordable) => {
      const { keyword, count } = query
      return resultSuccess(demoList(keyword, count))
    },
  },
] as MockMethod[]
