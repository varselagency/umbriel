import { app, ipcMain, BrowserWindow, shell } from "electron";
import { release } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const { autoUpdater } = createRequire(import.meta.url)("electron-updater");
function update(win2) {
  autoUpdater.autoDownload = false;
  autoUpdater.disableWebInstaller = false;
  autoUpdater.allowDowngrade = false;
  autoUpdater.on("checking-for-update", function() {
  });
  autoUpdater.on("update-available", (arg) => {
    win2.webContents.send("update-can-available", { update: true, version: app.getVersion(), newVersion: arg == null ? void 0 : arg.version });
  });
  autoUpdater.on("update-not-available", (arg) => {
    win2.webContents.send("update-can-available", { update: false, version: app.getVersion(), newVersion: arg == null ? void 0 : arg.version });
  });
  ipcMain.handle("check-update", async () => {
    if (!app.isPackaged) {
      const error = new Error("The update feature is only available after the package.");
      return { message: error.message, error };
    }
    try {
      return await autoUpdater.checkForUpdatesAndNotify();
    } catch (error) {
      return { message: "Network error", error };
    }
  });
  ipcMain.handle("start-download", (event) => {
    startDownload(
      (error, progressInfo) => {
        if (error) {
          event.sender.send("update-error", { message: error.message, error });
        } else {
          event.sender.send("download-progress", progressInfo);
        }
      },
      () => {
        event.sender.send("update-downloaded");
      }
    );
  });
  ipcMain.handle("quit-and-install", () => {
    autoUpdater.quitAndInstall(false, true);
  });
}
function startDownload(callback, complete) {
  autoUpdater.on("download-progress", (info) => callback(null, info));
  autoUpdater.on("error", (error) => callback(error, null));
  autoUpdater.on("update-downloaded", complete);
  autoUpdater.downloadUpdate();
}
globalThis.__filename = fileURLToPath(import.meta.url);
globalThis.__dirname = dirname(__filename);
process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, "../public") : process.env.DIST;
if (release().startsWith("6.1"))
  app.disableHardwareAcceleration();
if (process.platform === "win32")
  app.setAppUserModelId(app.getName());
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}
let win = null;
const preload = join(__dirname, "../preload/index.mjs");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");
async function createWindow() {
  win = new BrowserWindow({
    title: "Umbriel",
    width: 1600,
    height: 900,
    autoHideMenuBar: true,
    fullscreen: false,
    fullscreenable: false,
    roundedCorners: true,
    frame: true,
    resizable: true,
    icon: join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload
    }
  });
  if (url) {
    win.loadURL(url);
  } else {
    win.loadFile(indexHtml);
  }
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.webContents.setWindowOpenHandler(({ url: url2 }) => {
    if (url2.startsWith("https:"))
      shell.openExternal(url2);
    return { action: "deny" };
  });
  update(win);
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin")
    app.quit();
});
app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized())
      win.restore();
    win.focus();
  }
});
app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
//# sourceMappingURL=index.js.map
