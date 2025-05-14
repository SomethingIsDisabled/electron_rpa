const { BrowserWindow } = require('electron')
// const { logger } = require('log.ts')
/**
 * 发送日志到渲染进程
 * @param {string} log - 要发送的日志信息
 * @description 该函数用于将日志信息从主进程发送到渲染进程。
 * 如果当前有聚焦的窗口，日志将通过IPC发送到渲染进程；
 * 如果没有聚焦的窗口，日志将直接输出到控制台。
 */
const sendLog = (log: string) => {
//   logger.info(log)
  const win = BrowserWindow.getFocusedWindow()
  if (win) {
    win.webContents.send('playwright-log', log)
  } else {
    console.log(log)
  }
}

export { sendLog }
