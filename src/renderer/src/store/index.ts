import useConfigStore from './config'

export default function useStore() {
  return {
    configStore: useConfigStore()
  }
}
