import React, {useContext, useState, useEffect} from "react";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {createDir} from "../../http/file";
import {toJS} from "mobx";

const PopupCreateFile = observer(() => {
    const [dirName, setDirName] = useState("")
    const [validErr, setValidErr] = useState("")
    const [validErrInput, setValidErrInput] = useState(false)
    const [formError, setFormError] = useState(false)
    const {file} = useContext(Context)
    const files = toJS(file.getFiles)

    const createDirHandler = () => {
        createDir(file.getCurrentDir, dirName).then(r => file.addFile(r))
        file.setPopupDisplay("none")
        setDirName("")
        setValidErrInput(false)
    }

    const validDir = (dir) => {
        const emailRegex = /[/:*?"<>|\s\\]/
        return emailRegex.test(dir)
    }

    const clearValidation = () => {
        setValidErr("")
        setFormError(true)
        setValidErrInput(false)
    }

    useEffect(() => {
        const checkValid = (dirName) => {
            if (dirName === "") {
                setValidErr("Пустое поле")
                setFormError(true)
                setValidErrInput(true)
            } else if (validDir(dirName)) {
                setValidErr("Недопустимые значения")
                setFormError(true)
                setValidErrInput(true)
            } else {
                setValidErr("")
                setFormError(false)
                setValidErrInput(false)
            }
        }
        checkValid(dirName)

    }, [dirName])

    useEffect(() => {
        if (files) {
            const answer = files.some(item => {
                return item.name === dirName
            })
            if (answer) {
                setValidErr("Папка с таким названием есть")
                setFormError(true)
            }
        }
    }, [files, dirName])

    useEffect(() => {
        clearValidation();
    }, []);

    return (
        <div className="popup"
             onClick={() => {file.setPopupDisplay("none"); setDirName(""); setValidErr("");
                 setValidErrInput(false)}}
                 style={{display: file.getPopupDisplay}}>
            <div className="popup__container" onClick={(e) => e.stopPropagation()}>
                <div className="popup__header">
                    <h1 className="popup__header__title">Создать новую папку</h1>
                    <button className="popup__header__close"
                            onClick={() => {file.setPopupDisplay("none"); setDirName(""); setValidErr("");
                                setValidErrInput(false)}}
                    >X</button>
                </div>
                <label className="popup__form-label">
                    <input type="text"
                           className={validErrInput ? "form__input_type_error" : ""}
                           placeholder="Введите название папки"
                           value={dirName}
                           onChange={e => setDirName(e.target.value)}
                    />
                    <span className="form__input-error email-input-error">{validErr}</span>
                </label>
                <button className="popup__create"
                        style={{ backgroundColor: formError ? "#ccc" : "" }}
                        disabled={formError}
                        onClick={() => createDirHandler()}>Создать</button>
            </div>
        </div>
    );
});

export default PopupCreateFile;