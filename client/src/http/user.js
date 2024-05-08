import {$authHost, $host} from "./index"
import {jwtDecode} from 'jwt-decode'

export const registration = async (email, password, name, surname) => {
    const {data} = await $host.post('api/user/registration', {email, password, role: 'USER', name, surname})
    return jwtDecode(data.token)
}

export const deleteUser = async (email) => {
    const response = await $authHost.delete('api/user/delete', {
        data: { email }
    })
    return response
}

export const getUsers = async () => {
    const {data} = await $authHost.get('api/user/users')
    return data
}


export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const uploadAvatar = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const {data} = await $authHost.post('api/files/avatar', formData)
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const deleteAvatar = async () => {
    const {data} = await $authHost.delete('api/files/avatar')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}