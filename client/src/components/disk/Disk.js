import React, {useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {getFiles, uploadFile} from "../../http/file";
import FileList from "./fileList/FileList";
import "./disk.css"
import PopupCreateFile from "./PopupCreateFile";
import Uploader from "./uploader/Uploader";
import sizeFormat from "../../untils/sizeFormat";

const Disk = observer (() => {

    const {file, upload, loader, user} = useContext(Context)
    const dirStack = file.getDirStack
    const [dragEnter, setDragEnter] = useState(false)
    const [sort, setSort] = useState('type')


    useEffect(() => {
        loader.showLoader()
        getFiles(file.getCurrentDir, sort).then(data => {
            file.setFiles(data)
        })
        loader.hideLoader()
    }, [loader, file, file.getCurrentDir, sort])



    function showPopup() {
        file.setPopupDisplay("flex")
    }

    const backButtonHandler = () => {
        const backDirId = dirStack.pop()
        file.setCurrentDir(backDirId)
    }

    function uploadFilesOnServer (files) {
        console.log(files)

        const notFile = files.some(file => file.type === '')

        if (notFile) {
            alert(`Ошибка: нельзя загрузить папку`)
            return
        }

        const duplicateFile = file.getFiles.find(file => files.some(existingFile => existingFile.name === file.name))
        if (duplicateFile) {
            alert(`Ошибка: Файл с именем ${duplicateFile.name} уже существует`)
            return
        }
        upload.showUploader()
        files.forEach((item, index) => {
            setTimeout(() => {
                const uploaderFile = {id: Math.random().toString(36).substr(2, 9), name: item.name, progress: 0}
                upload.addUploadFile(uploaderFile)
                console.log(item)
                uploadFile(item, file.getCurrentDir, (progress) => {
                    uploaderFile.progress = progress
                    upload.changeUploadFile(uploaderFile)
                }).then(r => {
                    file.addFile(r.dbFile)
                    user.setSpace(r.usedSpace)
                    console.log(r)
                })
                    .catch(r => {
                        console.log(r.response.data.message.message)
                        alert(r.response.data.message.message)
                    })
            }, index * 500) // Умножаем на индекс, чтобы каждый файл отправлялся с задержкой
        })
    }

    function fileUploadHandler(e) {
        const files = [...e.target.files]
        console.log(files)
        uploadFilesOnServer(files)
    }

    const dragEnterHandler = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragEnter(true)
    }

    const dragLeaveHandler = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragEnter(false)
    }

    function dropHandler(e) {
        e.preventDefault()
        e.stopPropagation()
        const files = [...e.dataTransfer.files]
        uploadFilesOnServer(files)
        setDragEnter(false)
    }

    if (loader.boolLoader) {
        return (
            <div className="loader">
                <div className="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        )
    }

    return ( dragEnter ?
            <div className="drop-area"
                 onDrop={dropHandler}
                 onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}
            >
                Перетащите файлы сюда
            </div>
            :
            <div className="disk" onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
                <div className="disk__buttons">
                    <button className="disk__back" onClick={() => backButtonHandler()}>Назад</button>
                    <div className="disk__select-buttons">
                        <select value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="disk__select"
                        >
                            <option className="disk__select__option" value="name">По имени</option>
                            <option className="disk__select__option" value="type">По типу</option>
                            <option className="disk__select__option" value="date">По дате</option>
                        </select>
                        <div className="disc__sub-btns">
                            <button  className={"disk__plate-big" + (file.getView === 'plateBig' ? " active-plate-big" : "")}
                                     onClick={() => file.setFileView('plateBig')}
                            />
                            <button className={"disk__plate" + (file.getView === 'plate' ? " active-plate" : "")}
                                    onClick={() => file.setFileView('plate')}
                            />
                            <button className={"disk__list" + (file.getView === 'list' ? " active-list" : "")}
                                    onClick={() => file.setFileView('list')}
                            />
                        </div>
                    </div>
                    <button className="disk__create" onClick={() => showPopup()}>Создать папку</button>
                    <div className="disk__upload">
                        <label htmlFor="disk__upload-input" className="disk__upload-load">Загрузить файл</label >
                        <input multiple={true} id="disk__upload-input" type="file"
                               className="disk__upload-input"
                               onChange={(e) => fileUploadHandler(e)}/>
                    </div>
                    <div className="disk__space">
                        <div className="disk__space-bar">
                            <div className="disk__space-upload"
                                 style={{width: (user.Space / user.user.diskSpace * 100).toFixed(2) + "%"}} />
                        </div>
                        <div className="disk__space-bar-info">
                            Занято {sizeFormat(user.Space)}\{sizeFormat(user.user.diskSpace)}
                        </div>
                    </div>
                </div>

                <FileList />
                <PopupCreateFile />
                <Uploader />
            </div>

    );
});

export default Disk;