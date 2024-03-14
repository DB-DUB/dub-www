import { unref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export function useHistory() {
  const router = useRouter()
  const route = useRoute()

  function handlePath(params) {
    const { path, query } = unref(router.currentRoute)
    router.replace({
      path,
      query: { ...query, searchParams: JSON.stringify(params) }
      // name: name || undefined,
    })
  }

  function handleParams() {
    if (route.query.searchParams) {
      return JSON.parse(route.query.searchParams)
    } else return
  }

  return { handlePath, handleParams }
}
