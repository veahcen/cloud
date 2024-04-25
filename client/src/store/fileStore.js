import { makeAutoObservable } from "mobx";

export default class FileStore {
    constructor() {
        this._files = []
        this._currentDir = null // текущая директория, id папки, в которой находимся в данный момент
        this._popupDisplay = 'none'
        this._dirStack = []
        this._view = 'list'
        makeAutoObservable(this)
    }

    setFiles(files) {
        this._files = files
    }

    setCurrentDir(dir) {
        this._currentDir = dir
    }

    addFile(file) {
        this._files.push(file)
    }

    setPopupDisplay(display) {
        this._popupDisplay = display
    }

    pushToStack(dir) {
        this._dirStack.push(dir)
    }

    deleteFileAct(dirId) {
        this._files = this._files.filter(file => file._id !== dirId)
    }

    setFileView(view) {
        this._view = view
    }

    get getFiles() {
        return this._files
    }

    get getCurrentDir() {
        return this._currentDir
    }

    get getPopupDisplay() {
        return this._popupDisplay
    }

    get getDirStack() {
        return this._dirStack
    }

    get getView() {
        return this._view
    }
}
