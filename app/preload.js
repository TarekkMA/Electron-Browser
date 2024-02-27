var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { contextBridge, ipcRenderer } = require('electron');
console.log("test");
contextBridge.exposeInMainWorld('api', {
    back: () => __awaiter(this, void 0, void 0, function* () { return yield ipcRenderer.invoke('back'); }),
    forward: () => __awaiter(this, void 0, void 0, function* () { return yield ipcRenderer.invoke('forward'); }),
    onUpdateURL: (callback) => ipcRenderer.on('update-url', (_event, value) => callback(value)),
});
//# sourceMappingURL=preload.js.map