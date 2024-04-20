import React, {useContext} from 'react'
import './NavBar.css'
import Logo from '../../assets/cloud.svg'
import {NavLink} from "react-router-dom";
import {REGISTRATION_ROUTE, LOGIN_ROUTE} from "../../untils/consts";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";

const NavBar = observer(() => {
    const {user} = useContext(Context)

    return (
            <div className='navbar'>
                <div className='container'>
                    <img src={Logo} alt="облако" className='navbar__logo'/>
                    <h1 className='navbar__header'>CorpCloud</h1>
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
                    {user.isAuth &&
                        <div className='button navbar__login' onClick={() => user.logout()}>
                            Выйти
                        </div>
                    }
                </div>
            </div>
    );
})

export default NavBar