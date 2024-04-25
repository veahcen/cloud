import React, {useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {getFiles, uploadFile} from "../../http/file";
import FileList from "./fileList/FileList";
import "./disk.css"
import PopupCreateFile from "./PopupCreateFile";
import Uploader from "./uploader/Uploader";

const Disk = observer (() => {

    const {file, upload, loader} = useContext(Context)
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
                    console.log(r)
                })
            }, index * 500) // Умножаем на индекс, чтобы каждый файл отправлялся с задержкой
        })
    }

    function fileUploadHandler(e) {
        const files = [...e.target.files]
        console.log(files)
        upload.showUploader()
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
        upload.showUploader()
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
                    <button className="disk__create" onClick={() => showPopup()}>Создать папку</button>
                    <div className="disk__upload">
                        <label htmlFor="disk__upload-input" className="disk__upload-load">Загрузить файл</label >
                        <input multiple={true} id="disk__upload-input" type="file"
                               className="disk__upload-input"
                               onChange={(e) => fileUploadHandler(e)}/>
                    </div>
                    {/*<div className="disk__space">*/}
                    {/*    <div className="disk__space-bar"></div>*/}
                    {/*    <div className="disk__space-bar-info">Занято 9,5Mb\500Mb</div>*/}
                    {/*</div>*/}
                    <select value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="disk__select"
                    >
                        <option value="name">По имени</option>
                        <option value="type">По типу</option>
                        <option value="date">По дате</option>
                    </select>
                    <button className="disk__plate-big" onClick={() => file.setFileView('plateBig')}/>
                    <button className="disk__plate" onClick={() => file.setFileView('plate')}/>
                    <button className="disk__list" onClick={() => file.setFileView('list')}/>
                </div>

                <FileList />
                <PopupCreateFile />
                <Uploader />
            </div>

    );
});

export default Disk;