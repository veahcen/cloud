import React, {useContext} from 'react';
import './uploader.css'
import UploadFile from "./UploadFile";
import {observer} from "mobx-react-lite";
import {Context} from "../../../index";

const Uploader = observer(() => {
    const {upload} = useContext(Context)
    const files = upload.getFilesUploader

    return (upload.getVisible &&
        <div className="uploader">
            <div className="uploader__header">
                <div className="uploader__title">Загрузки</div>
                <button className="uploader__close" onClick={() => {upload.hideUploader()}}>X</button>
            </div>
            {files.map(item => (
                <UploadFile key={item.id} file={item} />
            ))}
        </div>
    );
});

export default Uploader;