import React from "react";
import "./fileList.css"
import {useContext} from "react";
import {Context} from "../../../index";
import File from "./File/File";
import {observer} from "mobx-react-lite";
import {CSSTransition, TransitionGroup} from "react-transition-group";

const FileList = observer(() => {
    const {file} = useContext(Context)
    const files = file.getFiles

    return (
        <div className="file-list">
            <div className="file-list__header">
                <div className="file-list-name">Название</div>
                <div className="file-list-date">Дата</div>
                <div className="file-list-size">Размер</div>
            </div>
            <TransitionGroup >
                {files && files.map(file => (
                    <CSSTransition
                        key={file._id}
                        timeout={500}
                        className='file'
                        exit={false}
                    >
                        <File filez={file} />
                    </CSSTransition>
                ))}
            </TransitionGroup>
        </div>
    );
});

export default FileList;
