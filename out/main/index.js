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
const { chromium } = require("playwright");
path__namespace.basename(__filename);
const testFunc = async (options) => {
  const { port: port2, envList } = options;
  const id = envList[0].shopId;
  const startUrl = `http://127.0.0.1:${port2}/api/v2/browser/start?account_id=${id}`;
  let res = await $fetch(startUrl);
  console.log(res);
  let browserUrl;
  if (res && res.status !== 0) {
    browserUrl = `http://${res.data.ws.selenium}`;
  } else {
    return;
  }
  let browser, context, page;
  browser = await chromium.connectOverCDP(browserUrl);
  context = browser.contexts()[0];
  page = await context.newPage();
  let waitTime = Math.floor(Math.random() * (5e3 - 500 + 1)) + 500;
  await page.waitForTimeout(waitTime);
  const pages = await page.context().pages();
  for (const p of pages) {
    if (p !== page) {
      await p.close();
    }
  }
  await page.goto(`https://2captcha.cn/demo/clickcaptcha`, { timeout: 18e4 });
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
  electron.ipcMain.on("run-playwright", (event, data) => testFunc(data));
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
