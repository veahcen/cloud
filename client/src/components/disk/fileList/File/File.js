import React, {useContext} from "react";
import "./file.css"

import fileSvg from "../../../../assets/file.svg"
import folderSvg from "../../../../assets/folder.svg"
import {observer} from "mobx-react-lite";
import {Context} from "../../../../index";
import {deleteFile, downloadFile} from "../../../../http/file";
import sizeFormat from "../../../../untils/sizeFormat";

const File = observer(({filez}) => {
    const {file} = useContext(Context)
    const currentDir = file.getCurrentDir

    const openDirHandler = () => {
        if (filez.type === "dir") {
            file.setCurrentDir(filez._id)
            file.pushToStack(currentDir)
        }
    }

    function downloadClickHandler(e) {
        e.stopPropagation()
        downloadFile(filez)
    }

    function deleteClickHandler(e) {
        e.stopPropagation()
        file.deleteFileAct(filez._id)
        deleteFile(filez).then(r => {
            console.log(r)
        })

    }

    if (file.getView === 'list') {
        return (
            <div className="file" onClick={() => openDirHandler(filez)}>
                <img src={filez.type === "dir" ? folderSvg : fileSvg}
                     alt={filez.type === "dir" ? "папка" : "файл"}
                     className="file__img"/>
                <div className="file__name">{filez.name}</div>
                <div className="file__date">{filez.date.slice(0, 10)}</div>
                <div className="file__size">{sizeFormat(filez.size)}</div>
                {filez.type !== 'dir' && <button className="file__btn file__download" onClick={(e) => downloadClickHandler(e)}>Скачать</button>}
                <button onClick={(e) => deleteClickHandler(e)} className="file__btn file__delete">Удалить</button>
            </div>
        )
    }

    if (file.getView === 'plate') {
        return (
            <div className="file-plate" onClick={() => openDirHandler(filez)}>
                <img src={filez.type === "dir" ? folderSvg : fileSvg}
                     alt={filez.type === "dir" ? "папка" : "файл"}
                     className="file-plate__img"/>
                <div className="file-plate__name" title={filez.name}>{filez.name}</div>
                <div className="file-plate__buttons">
                    {filez.type !== 'dir' && <button className="file-plate__btn file__download" onClick={(e) => downloadClickHandler(e)}>Скачать</button>}
                    <button onClick={(e) => deleteClickHandler(e)} className="file-plate__btn file-plate__delete">Удалить</button>
                </div>
            </div>
        )
    }

    if (file.getView === 'plateBig') {
        return (
            <div className="file-plate file-plate-big" onClick={() => openDirHandler(filez)}>
                <img src={filez.type === "dir" ? folderSvg : fileSvg}
                     alt={filez.type === "dir" ? "папка" : "файл"}
                     className="file-plate__img file-plate__img-big"/>
                <div className="file-plate__name file-plate__name-big" title={filez.name}>{filez.name}</div>
                <div className="file-plate__buttons">
                    {filez.type !== 'dir' && <button className="file-plate__btn file__download" onClick={(e) => downloadClickHandler(e)}>Скачать</button>}
                    <button onClick={(e) => deleteClickHandler(e)} className="file-plate__btn file-plate__delete">Удалить</button>
                </div>
            </div>
        )
    }


})

export default File;