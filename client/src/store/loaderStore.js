import { makeAutoObservable } from "mobx";

export default class LoaderStore {

    constructor() {
        this._loader = true
        makeAutoObservable(this)
    }

    showLoader() {
        this._loader = true
    }

    hideLoader() {
        this._loader = false
    }

    get boolLoader() {
        return this._loader
    }
}
