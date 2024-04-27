import { makeAutoObservable } from "mobx"

export default class UserStore {
    constructor() {
        this._user = {}
        this._isAuth = false
        this._role = 'USER'
        this._avatar = null
        this._useSpace = 0
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

    setSpace(space) {
        this._useSpace = space
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

    get Space() {
        return this._useSpace
    }

    logout() {
        localStorage.removeItem('token')
        this._user = {}
        this._isAuth = false
        this._role = 'USER'
    }
}