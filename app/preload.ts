const { contextBridge, ipcRenderer } = require('electron');

console.log("test")

contextBridge.exposeInMainWorld(
  'api', {
    back: async () => await ipcRenderer.invoke('back'),
    forward: async () => await ipcRenderer.invoke('forward'),
    onUpdateURL: (callback: any) => ipcRenderer.on('update-url', (_event, value) => callback(value)),
  }
);