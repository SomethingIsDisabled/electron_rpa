import { ElectronAPI } from '@electron-toolkit/preload'
import { envItemType } from '@/typings/global'

declare global {
  interface Window {
    electron: ElectronAPI
    api: IApi
  }

  interface IOptions {
    port: string | number
    envList: envItemType[]
  }

  interface IApi {
    run: (IOptions) => void
  }
}

export {}
