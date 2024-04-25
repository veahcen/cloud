import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../../index";
import {deleteAvatar, uploadAvatar} from "../../../http/user";

const Profile = observer(() => {
    const {user} = useContext(Context)

    function fileUploadHandler(e) {
        const file = e.target.files[0]
        console.log(file)
        uploadAvatar(file).then(r => {user.setUser(r); user.setAvatar(r.avatar); })
    }

    return (
        <div>
            <button onClick={() => deleteAvatar().then(r => {user.setUser(r); user.setAvatar(r.avatar)})}>Удалить аватар</button>
            <input accept="image/*" onChange={e => {
                console.log(e)
                fileUploadHandler(e)
            }} type="file" placeholder="Загрузить аватар"/>
        </div>
    );
});

export default Profile;