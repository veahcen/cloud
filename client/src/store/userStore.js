import { makeAutoObservable } from "mobx"

export default class UserStore {
    _user = {}
    _isAuth = false
    _role = 'USER'

    constructor() {
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

    get user() {
        return this._user
    }

    get isAuth() {
        return this._isAuth
    }

    get IsRole() {
        return this._role
    }

    logout() {
        localStorage.removeItem('token')
        this._user = {}
        this._isAuth = false
        this._role = 'USER'
    }
}