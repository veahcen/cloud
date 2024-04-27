import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../../index";
import {deleteAvatar, uploadAvatar} from "../../../http/user";
import './profile.css'
import {API_URL} from "../../../config";
import avatarLog from "../../../assets/ava.svg";
import sizeFormat from "../../../untils/sizeFormat";

const Profile = observer(() => {
    const {user} = useContext(Context)
    const avatar = user.Avatar ? `${API_URL + user.Avatar}` : avatarLog
    function fileUploadHandler(e) {
        const file = e.target.files[0]
        console.log(file)
        uploadAvatar(file)
            .then(r => {user.setUser(r); user.setAvatar(r.avatar); user.setSpace(r.usedSpace)})
            .catch(e => alert(e.response.data.message))
    }

    return (
        <div className="user-page">
            <div className="user-page__box-1">
                <img className="user-page__avatar" src={avatar} alt="avatar"/>
                <div className="user-page__buttons">
                    <button
                        className="user-page__delete-avatar"
                        onClick={() => deleteAvatar().then(r => {user.setUser(r); user.setAvatar(r.avatar); user.setSpace(r.usedSpace)})}
                    >Удалить аватар</button>
                    <div className="user-page__uploader">
                        <label htmlFor="user-page__upload" className="user-page__label">Загрузить аватар</label>
                        <input accept="image/*"  id="user-page__upload"
                               className="user-page__upload"
                               onChange={e => {
                                   fileUploadHandler(e)
                               }} type="file"/>
                    </div>
                </div>
            </div>
            <div className="user-page__box-2">
                <div className="user-page__box-2-text">
                    <h2>Имя: {user.user.name}</h2>
                    <h2>Фамилия: {user.user.surname}</h2>
                </div>
                <div className="disk__space disk__space-user">
                    <div className="disk__space-bar">
                        <div className="disk__space-upload"
                             style={{width: (user.Space / user.user.diskSpace * 100).toFixed(2) + "%"}} />
                    </div>
                    <div className="disk__space-bar-info">
                        Занято {sizeFormat(user.Space)}\{sizeFormat(user.user.diskSpace)}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Profile;