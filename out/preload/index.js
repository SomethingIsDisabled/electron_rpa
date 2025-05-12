"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {
  HelloWorld: (value) => {
    preload.electronAPI.ipcRenderer.send("message-to-server", {
      module: "user",
      action: "read",
      data: {
        helloWorld: value
      }
    });
  }
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
