import axios from "axios"
import {API_URL} from "../config";

// для запросов не требующих авторизации
const $host = axios.create({
    baseURL: API_URL
})

const $authHost = axios.create({
    baseURL: API_URL
})
// подставлять токен каждому запросу
const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
}

$authHost.interceptors.request.use(authInterceptor)

export  {
    $host,
    $authHost
}