import {makeAutoObservable} from 'mobx';

export default class UploaderStore {
    constructor() {
        this._isVisible = false
        this._files = []
        makeAutoObservable(this)
    }

    showUploader() {
        this._isVisible = true
    }

    hideUploader() {
        this._isVisible = false
    }

    addUploadFile(file) {
        this._files.push(file)
    }

    removeUploadFile(fileId) {
        this._files = this._files.filter(file => file.id !== fileId)
    }

    changeUploadFile(payload) {
        this._files = this._files.map(file => {
            if (file.id === payload.id) {
                return { ...file, progress: payload.progress }
            }
            return file
        });
    }

    get getVisible() {
        return this._isVisible
    }

    get getFilesUploader() {
        return this._files
    }
}