"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
const icon = path.join(__dirname, "../../resources/icon.png");
const $fetch = async (fullUrl, options) => {
  try {
    const response = await fetch(fullUrl, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    throw new Error(`Request failed: ${error.message}`);
  }
};
const log4js = require("log4js");
log4js.configure({
  appenders: {
    out: { type: "stdout" },
    // 输出到控制台
    app: {
      type: "dateFile",
      // 使用 file appender 进行文件输出
      filename: "logs/app",
      // 日志文件路径（不需要扩展名，自动添加）
      pattern: "yyyy-MM-dd.log",
      // 日志文件轮换的模式，按天轮换
      alwaysIncludePattern: true,
      // 始终在文件名中添加日期后缀
      daysToKeep: 90,
      // 保留最近 90 天的日志文件
      compress: true
      // 启用日志文件压缩（.gz 格式）
    }
    // custom: {
    //   type: 'custom',
    //   appender: (logEvent) => {
    //     console.log(`111111`)
    //     console.log(logEvent)
    //   }
    // }
  },
  categories: {
    default: { appenders: ["out", "app"], level: "trace", enableCallStack: true }
    // playwright: { appenders: ['out', 'app'], level: 'trace', enableCallStack: true }
  }
});
try {
  console.log("222");
} catch (error) {
  console.error("Error configuring custom appender:", error);
  process.exit(1);
}
const logger = log4js.getLogger();
const pwLogger = log4js.getLogger("playwright");
const { chromium } = require("playwright");
const fileName = path__namespace.basename(__filename);
const testFunc = async (options) => {
  logger.trace(`${fileName}-开始执行`);
  const { port: port2, envList } = options;
  const id = envList[0].shopId;
  const startUrl = `http://127.0.0.1:${port2}/api/v2/browser/start?account_id=${id}`;
  let res = await $fetch(startUrl);
  console.log(res);
  let browserUrl;
  if (res && res.status !== 0) {
    browserUrl = `http://${res.data.ws.selenium}`;
    pwLogger.info(`${fileName}-链接获取成功-${browserUrl}`);
  } else {
    logger.error(`${fileName}-链接获取失败`);
    return;
  }
  let browser, context, page;
  try {
    logger.trace(`${fileName}-连接到_browserUrl_${browserUrl}`);
    browser = await chromium.connectOverCDP(browserUrl);
    context = browser.contexts()[0];
    page = await context.newPage();
    let waitTime = Math.floor(Math.random() * (5e3 - 500 + 1)) + 500;
    await page.waitForTimeout(waitTime);
    logger.trace(`${fileName}-关闭其他标签`);
    const pages = await page.context().pages();
    for (const p of pages) {
      if (p !== page) {
        await p.close();
      }
    }
    await page.goto(
      `https://yb7ao262ru.feishu.cn/base/J02Ob4GLfatFqzscPHccmcRcn2f?table=tblWrlPtOBQq4UKA&view=vewQx72054`,
      { timeout: 18e4 }
    );
    await page.waitForSelector(`[data-e2e='suite-more-btn']`, { timeout: 18e4 });
    await page.click(`[data-e2e='suite-more-btn']`);
    await page.waitForSelector(`[data-e2e='suite-more-menu']`, { timeout: 3e4 });
    waitTime = Math.floor(Math.random() * (1212 - 321 + 1)) + 321;
    await page.waitForTimeout(waitTime);
    await page.hover(`[data-e2e='suite-more-menu'] li[text='导出']`);
    await page.waitForSelector(`[id*=EXPORT-popup] [data-menu-id*='-0']`, {
      timeout: 3e4
    });
    await page.hover(`[id*=EXPORT-popup] [data-menu-id*='-0']`);
    await page.click(`[id*=EXPORT-popup] [data-menu-id*='-0']`);
    logger.trace(`${fileName}-点击下载`);
    await page.waitForSelector(`.ud__dialog__wrap .ud__button--filled-default`, {
      timeout: 3e4
    });
    page.on("download", async (download2) => {
      logger.trace(`${fileName}-文件开始下载`, download2.url());
      const path2 = await download2.path();
      console.log("临时保存路径:", path2);
      logger.trace(`${fileName}-临时保存路径`, path2);
      await download2.saveAs("/path/to/save/file.xlsx");
    });
    await page.click(`.ud__dialog__wrap .ud__button--filled-default`);
    logger.trace(`${fileName}-开始下载`);
    const download = await page.waitForEvent("download");
    logger.trace(`${fileName}-尝试保存至resource`);
    await download.saveAs(`${process.cwd()}/download/rpa_test.xlsx`);
    await download.path();
    logger.trace(`${fileName}-下载完成`);
    console.log("下载完成");
  } catch (error) {
    logger.error(`${fileName}-执行失败-${error}`);
  }
};
const port = "50213";
const clientConfig = {
  port
};
const defaultPort = clientConfig.port;
let curPort = defaultPort;
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 1200,
    height: 900,
    show: false,
    autoHideMenuBar: false,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      // preload: join(app.getAppPath(), 'out', '/preload/index.js'),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  electron.ipcMain.on("run-playwright", (event, data) => testFunc({ ...{ port: curPort }, ...data }));
  electron.ipcMain.on("set-port", (event, data) => {
    if (data && Number(data)) {
      curPort = data;
      console.log(`set-port`, curPort);
    }
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
