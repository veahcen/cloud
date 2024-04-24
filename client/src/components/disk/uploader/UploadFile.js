import React, {useContext} from 'react';
import './uploadFile.css'
import {observer} from "mobx-react-lite";
import {Context} from "../../../index";

const UploadFile = observer(({file}) => {
    const {upload} = useContext(Context)

    return (
        <div className="upload-file">
            <div className="upload-file__header">
                <div className="upload-file__name">{file.name}</div>
                <button className="upload-file__close" onClick={() => upload.removeUploadFile(file.id)}>X</button>
            </div>
            <div className="upload-file__progress-bar">
                <div className="upload-file__upload-bar" style={{width: file.progress + "%"}}/>
                <div className="upload-file__percent">{file.progress}%</div>
            </div>
        </div>
    );
});

export default UploadFile;