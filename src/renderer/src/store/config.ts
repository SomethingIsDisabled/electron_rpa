import { defineStore } from 'pinia'

import config from '../../../../resources/config.json'

export interface IConfig {
  /** 云登api端口 */
  port: string
  /** 端口是否可用 */
  isPortAvailable: boolean

}

const configStore = defineStore('config', {
  state: (): IConfig => ({
    port: '',
    isPortAvailable: false
  }),
  getters: {
    apiPort: (state) => state.port || config.port || '50213'
  },
  actions: {
    /** 设置端口 */
    setPort(port: string | number) {
      this.port = port.toString()
    }
  }
})

export default configStore
