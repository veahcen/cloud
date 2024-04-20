import { makeAutoObservable } from "mobx"

export default class FileStore {
    files = []
    currentDir = null // текущая директория, id папки, в которой находимся в данный момент
    popupDisplay = 'none'
    dirStack = []
    view = 'list'

    constructor() {
        makeAutoObservable(this)
    }

    setFiles(files) {
        this.files = files
    }

    setCurrentDir(dir) {
        this.currentDir = dir
    }

    addFile(file) {
        this.files.push(file)
    }

    setPopupDisplay(display) {
        this.popupDisplay = display
    }

    pushToStack(dir) {
        this.dirStack.push(dir)
    }

    deleteFile(dirId) {
        this.files = this.files.filter(file => file._id !== dirId)
    }

    setFileView(view) {
        this.view = view
    }

    get getFiles() {
        return this.files;
    }

    get getCurrentDir() {
        return this.currentDir;
    }

    get getPopupDisplay() {
        return this.popupDisplay;
    }

    get getDirStack() {
        return this.dirStack;
    }

    get getView() {
        return this.view;
    }
}
