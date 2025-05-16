/* eslint-disable prefer-const */
import * as path from 'path'
import { $fetch } from './utils/fetchIndex.js'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { chromium } = require('playwright')
import { logger, pwLogger } from './utils/logCom'

const fileName = path.basename(__filename)
/**
 * 主函数：playwright启动入口
 * @param port 端口号
 */
const testFunc = async (options) => {
  logger.trace(`${fileName}-开始执行`)
  const { port, envList } = options
  const id = envList[0].shopId
  const startUrl = `http://127.0.0.1:${port}/api/v2/browser/start?account_id=${id}`
  let res = await $fetch(startUrl)
  console.log(res)

  // 1.1 获取链接
  let browserUrl
  if (res && res.status !== 0) {
    browserUrl = `http://${res.data.ws.selenium}`
    pwLogger.info(`${fileName}-链接获取成功-${browserUrl}`)
  } else {
    logger.error(`${fileName}-链接获取失败`)
    return
  }
  let browser, context, page
  try {
    logger.trace(`${fileName}-连接到_browserUrl_${browserUrl}`)
    browser = await chromium.connectOverCDP(browserUrl)
    context = browser.contexts()[0]
    page = await context.newPage()
    // 设置一个等待时间变量
    let waitTime = Math.floor(Math.random() * (5000 - 500 + 1)) + 500
    await page.waitForTimeout(waitTime)
    logger.trace(`${fileName}-关闭其他标签`)
    // 获取所有页面
    const pages = await page.context().pages()
    // 关闭其他标签
    for (const p of pages) {
      if (p !== page) {
        await p.close()
      }
    }
    await page.goto(
      `https://yb7ao262ru.feishu.cn/`,
      { timeout: 180000 }
    )

    await page.waitForSelector(`[data-e2e='suite-more-btn']`, { timeout: 180000 })
    await page.click(`[data-e2e='suite-more-btn']`)
    await page.waitForSelector(`[data-e2e='suite-more-menu']`, { timeout: 30000 })
    waitTime = Math.floor(Math.random() * (1212 - 321 + 1)) + 321
    await page.waitForTimeout(waitTime)
    await page.hover(`[data-e2e='suite-more-menu'] li[text='导出']`)
    await page.waitForSelector(`[id*=EXPORT-popup] [data-menu-id*='-0']`, {
      timeout: 30000
    })

    await page.hover(`[id*=EXPORT-popup] [data-menu-id*='-0']`)
    await page.click(`[id*=EXPORT-popup] [data-menu-id*='-0']`)
    logger.trace(`${fileName}-点击下载`)
    await page.waitForSelector(`.ud__dialog__wrap .ud__button--filled-default`, {
      timeout: 30000
    })
    // 监听下载事件
    page.on('download', async (download) => {
      logger.trace(`${fileName}-文件开始下载`, download.url())

      // 获取下载路径
      const path = await download.path() // 获取临时路径
      console.log('临时保存路径:', path)
      logger.trace(`${fileName}-临时保存路径`, path)

      // // 设置自定义下载路径并保存
      await download.saveAs('/path/to/save/file.xlsx')
    })

    await page.click(`.ud__dialog__wrap .ud__button--filled-default`)
    logger.trace(`${fileName}-开始下载`)
    const download = await page.waitForEvent('download')
    logger.trace(`${fileName}-尝试保存至resource`)
    await download.saveAs(`${process.cwd()}/download/rpa_test.xlsx`)
    
    await download.path() // 自动等待直到文件下载完毕
    logger.trace(`${fileName}-下载完成`)
    console.log('下载完成')

  } catch (error) {
    logger.error(`${fileName}-执行失败-${error}`)
  }
}

export { testFunc }
