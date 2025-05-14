import * as path from 'path'
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import ThreadPool from './utils/threadsPool'
import { sendLog } from './utils/communication'
// const { pwLogger, logger } = require('./utils/log.ts')

const fileName = path.basename(__filename)

/**
 * 主函数：playwright启动入口
 * @param port 端口号
 */
const mainFunc = async (port: string): Promise<void> => {
  console.log('mainFunc', port)
  // logger.info('mainFunc', port)
  sendLog(fileName)
  
}

export { mainFunc }
