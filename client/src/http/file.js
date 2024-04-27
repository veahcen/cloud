import {$authHost} from "./index"

export const getFiles = async (dirId, sort) => {
    let url = `api/files`
    if (dirId) {
        url = `api/files?parent=${dirId}`
    }
    if (sort) {
        url = `api/files?sort=${sort}`
    }
    if (dirId && sort) {
        url = `api/files?parent=${dirId}&sort=${sort}`
    }
    const {data} = await $authHost.get(url)
    return data
}

export const createDir = async (dirId, name) => {
    const {data} = await $authHost.post(`api/files`, {
        name,
        parent: dirId,
        type: 'dir'
    })
    return data
}

export const uploadFile = async (file, dirId, progressCallback) => {
    const formData = new FormData()
    formData.append('file', file)
    if (dirId) {
        formData.append('parent', dirId)
    }

    const {data} = await $authHost.post(`api/files/upload`, formData, {
        onUploadProgress: progressEvent => {
            const { loaded, total } = progressEvent;
            let percent = Math.floor((loaded * 100) / total);
            progressCallback(percent);
        }
    });
    localStorage.setItem('token', data.token)
    return data;
}

export async function downloadFile(file) {
    const response = await $authHost.get(`api/files/download?id=${file._id}`, {
        responseType: 'blob' // Указываем, что ожидаем blob в ответе
    });
    if (response.status === 200) {
        const blob = response.data
        const downloadUrl = window.URL.createObjectURL(blob) // получили с серверра файл в бинарном виде
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        link.remove()
    }
}

export const deleteFile = async (file) => {
    const {data} = await $authHost.delete(`api/files?id=${file._id}`)
    localStorage.setItem('token', data.token)
    return data
}

export const searchFile = async (search) => {
    const {data} = await $authHost.get(`api/files/search?search=${search}`)
    return data
}