import React, {useContext, useState} from 'react'
import './NavBar.css'
import Logo from '../../assets/cloud.svg'
import {NavLink} from "react-router-dom";
import {REGISTRATION_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE, DISK_ROUTE, ADMIN_ROUTE} from "../../untils/consts";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {getFiles, searchFile} from "../../http/file";
import avatarLog from '../../assets/ava.svg'
import {API_URL} from "../../config";

const NavBar = observer(() => {
    const {user, file} = useContext(Context)
    const [searchTimeOut, setSearchTimeOut] = useState('')
    console.log(user.user.avatar)
    const avatar = user.Avatar ? `${API_URL + user.Avatar}` : avatarLog


    function searchHandler(e) {
        if (searchTimeOut !== false) {
            clearTimeout(searchTimeOut)
        }
        if (e.target.value !== '') {
            setSearchTimeOut(setTimeout((value) => {
                searchFile(value).then(data => {
                    file.setFiles(data)
                })
            }, 500, e.target.value))
        }   else {
            getFiles(file.getCurrentDir).then(data => {
                file.setFiles(data)
            })
        }
    }

    return (
            <div className='navbar'>
                <div className='navbar__container'>
                    <NavLink to={DISK_ROUTE} className="navbar__container-logo">
                        <img src={Logo} alt="облако" className='navbar__logo'/>
                        <h1 className='navbar__header'>CorpCloud</h1>
                    </NavLink>

                    {user.isAuth &&
                        <input className="navbar__search"
                               onChange={(e) => searchHandler(e)}
                               type="text"
                               placeholder="Введите название..."
                        />
                    }
                    {!user.isAuth &&
                        <div className='button navbar__login'>
                            <NavLink to={LOGIN_ROUTE} activeclassname="active">Войти</NavLink>
                        </div>
                    }
                    {!user.isAuth &&
                        <div className='button navbar__registration' >
                            <NavLink to={REGISTRATION_ROUTE} activeclassname="active">Регистрация</NavLink>
                        </div>
                    }
                    {user.isAuth && user.IsRole === 'ADMIN' &&
                        <div className="navbar__panel">
                            <NavLink to={ADMIN_ROUTE}>
                                Панель администратора
                            </NavLink>
                        </div>
                    }
                    {user.isAuth &&
                        <div className='button navbar__login' onClick={() => user.logout()}>
                            Выйти
                        </div>
                    }
                    {user.isAuth && <NavLink to={PROFILE_ROUTE} className="navbar__avatar" >
                        <img className="navbar__avatar" src={avatar} alt="avatar"/>
                    </NavLink>}
                </div>
            </div>
    );
})

export default NavBar