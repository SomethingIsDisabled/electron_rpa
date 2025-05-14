import { electronAPI } from '@electron-toolkit/preload'

const api = {
  run: (options) => {
    electronAPI.ipcRenderer.send('run-playwright', options)
  }
}

export default api
