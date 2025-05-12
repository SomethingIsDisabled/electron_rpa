import { apiUrls } from './apiUrls'
import { $fetch } from './fetchIndex'
import useStore from '@/store'

const baseUrl = `http://localhost`

export function useYDApi() {
  const { configStore } = useStore()

  /**
   * Port Status
   */
  const getStatus = async () => {
    const fullUrl = `${baseUrl}:${configStore.apiPort}${apiUrls.getStatus}`
    // console.log(fullUrl)
    const options = {
      method: 'GET'
    }
    try {
      return await $fetch(fullUrl, options)
    } catch (err) {
      return err
    }
  }

  /**
   * environments list
   */
  const getEnvList = async () => {
    const fullUrl = `${baseUrl}:${configStore.apiPort}${apiUrls.getEnvList}`
    console.log(fullUrl)
    const options = {
      method: 'POST'
    }
    try {
      return await $fetch(fullUrl, options)
    } catch (err) {
      return err
    }
  }
  return {
    getStatus,
    getEnvList
  }
}
