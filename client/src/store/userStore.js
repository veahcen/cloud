import { makeAutoObservable } from "mobx"

export default class UserStore {
    constructor() {
        this._user = {}
        this._isAuth = false
        this._role = 'USER'
        this._avatar = null
        makeAutoObservable(this)
    }

    setUser(user) {
        this._user = user
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }

    setIsRole(role) {
        this._role = role
    }

    setAvatar(avatar) {
        this._avatar = avatar
    }

    get user() {
        return this._user
    }

    get isAuth() {
        return this._isAuth
    }

    get IsRole() {
        return this._role
    }

    get Avatar() {
        return this._avatar
    }

    logout() {
        localStorage.removeItem('token')
        this._user = {}
        this._isAuth = false
        this._role = 'USER'
    }
}