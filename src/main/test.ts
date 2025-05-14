import * as path from 'path'
import { $fetch } from './utils/fetchIndex'
const { chromium } = require('playwright')

/**
 * 主函数：playwright启动入口
 * @param port 端口号
 */
const testFunc = async (options): Promise<void> => {
  const { port, envList } = options
  const id = envList[0].shopId
  const startUrl = `http://127.0.0.1:${port}/api/v2/browser/start?account_id=${id}`
  let res = await $fetch(startUrl)
  console.log(res)

  // 1.1 获取链接
  let browserUrl
  if (res && res.status !== 0) {
    browserUrl = `http://${res.data.ws.selenium}`
    // logger.info(`${fileName}-链接获取成功-${browserUrl}`)
  } else {
    // logger.error(`${fileName}-链接获取失败`)
    return
  }
  let browser, context, page
  //   logger.trace(`${fileName}-连接到_browserUrl_${browserUrl}`)
  browser = await chromium.connectOverCDP(browserUrl)
  context = browser.contexts()[0]
  page = await context.newPage()
  // 设置一个等待时间变量
  let waitTime = Math.floor(Math.random() * (5000 - 500 + 1)) + 500
  await page.waitForTimeout(waitTime)
  //   logger.trace(`${fileName}-关闭其他标签`)
  // 获取所有页面
  const pages = await page.context().pages()
  // 关闭其他标签
  for (const p of pages) {
    if (p !== page) {
      await p.close()
    }
  }
  await page.goto(`https://2captcha.cn/demo/clickcaptcha`, { timeout: 180000 })
}

export { testFunc }
