import { electronAPI } from '@electron-toolkit/preload'

const api = {
  HelloWorld: (value: string) => {
    electronAPI.ipcRenderer.send('message-to-server', {
      module: 'user',
      action: 'read',
      data: {
        helloWorld: value
      }
    })
  }
}

export default api
