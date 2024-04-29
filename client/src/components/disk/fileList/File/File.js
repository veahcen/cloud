import React, {useContext, useEffect, useState} from "react";
import "./file.css"

import fileSvg from "../../../../assets/file.svg"
import folderSvg from "../../../../assets/folder.svg"
import fileSvgDark from "../../../../assets/fileDark.svg"
import folderSvgDark from "../../../../assets/folderDark.svg"
import {observer} from "mobx-react-lite";
import {Context} from "../../../../index";
import {deleteFile, downloadFile} from "../../../../http/file";
import sizeFormat from "../../../../untils/sizeFormat";
import {API_URL} from "../../../../config";

const File = observer(({filez}) => {
    const {file, user} = useContext(Context)
    const currentDir = file.getCurrentDir
    const [colorScheme, setColorScheme] = useState(true)

    useEffect(() => {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')

        if (prefersDarkMode.matches) {
            setColorScheme(false)
        }

        prefersDarkMode.addEventListener("change", (evt) => {setColorScheme(evt.matches); window.location.reload()})
    }, [])

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
            user.setSpace(r.usedSpace)
            console.log(r)
        })

    }

    if (file.getView === 'list') {
        return (
            <div className="file" onClick={() => openDirHandler(filez)}>
                <img src={filez.type === "dir" ? (colorScheme ? folderSvg : folderSvgDark) : (colorScheme ? fileSvg : fileSvgDark)}
                     alt={filez.type === "dir" ? "папка" : "файл"}

                     className="file__img"/>
                <div className="file__name" onClick={filez.type !== "dir" ? () => window.open(API_URL + 'api/files/open?id=' + filez._id) : undefined}>{filez.name}</div>
                <div className="file__date">{filez.date.slice(0, 10)}</div>
                <div className="file__size">{sizeFormat(filez.size)}</div>
                {filez.type !== 'dir' && <button className="file__btn file__download" onClick={(e) => downloadClickHandler(e)}/>}
                <button className="file__btn file__downloadByLink"
                        onClick={(e) => {
                            if (filez.type !== 'dir') {
                                navigator.clipboard.writeText(API_URL + 'api/files/download/name?id=' + filez._id)
                            } else {
                                e.stopPropagation()
                                navigator.clipboard.writeText(API_URL + 'api/files/download/dir/name?id=' + filez._id)
                            }
                        }}
                />
                <button onClick={(e) => deleteClickHandler(e)} className="file__btn file__delete"/>
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
                    <button className="file-plate__btn file__downloadByLink"
                            onClick={(e) => {
                                if (filez.type !== 'dir') {
                                    navigator.clipboard.writeText(API_URL + 'api/files/download/name?id=' + filez._id)
                                } else {
                                    e.stopPropagation()
                                    navigator.clipboard.writeText(API_URL + 'api/files/download/dir/name?id=' + filez._id)
                                }
                            }}
                    />
                    {filez.type !== 'dir' && <button className="file-plate__btn file__download" onClick={(e) => downloadClickHandler(e)}/>}
                    <button onClick={(e) => deleteClickHandler(e)} className="file-plate__btn file__delete"/>
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
                    <button className="file-plate__btn file__downloadByLink"
                            onClick={(e) => {
                                if (filez.type !== 'dir') {
                                    navigator.clipboard.writeText(API_URL + 'api/files/download/name?id=' + filez._id)
                                } else {
                                    e.stopPropagation()
                                    navigator.clipboard.writeText(API_URL + 'api/files/download/dir/name?id=' + filez._id)
                                }
                            }}
                    />
                    {filez.type !== 'dir' && <button className="file-plate__btn file__download" onClick={(e) => downloadClickHandler(e)}/>}
                    <button onClick={(e) => deleteClickHandler(e)} className="file-plate__btn file__delete"/>
                </div>
            </div>
        )
    }


})

export default File;