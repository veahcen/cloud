import React, {useContext, useEffect, useState} from "react";
import "./authorization.css"
import {login} from "../../http/user";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";

const Authorization = observer(() => {
    const {user} = useContext(Context)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [formError, setFormError] = useState(false)
    const [load, setLoad] = useState(true)

    const singIn = async (evt) => {
        try {
            setLoad(false)
            evt.preventDefault()
            console.log(email, password)
            let data;
            data = await login(email, password)
            console.log(data)
            user.setUser(data)
            user.setIsAuth(true)
            user.setIsRole(data.role)
            user.setSpace(data.usedSpace)
            user.setAvatar(data.avatar)
            setLoad(true)
        } catch (e) {
            if (e.response?.data?.message) {
                alert(e.response.data.message)
                setLoad(true)
            }
        }

    }

    const validEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }


    const clearValidation = () => {
        setEmailError("")
        setPasswordError("")
        setFormError(true)
    }
    // вызывает validate только при изменении email или password
    useEffect(() => {
        const validate = (email, password) => {
            let isValid = true;
            if (email === "") {
                setEmailError("Пустое поле");
                isValid = false;
            } else if (!validEmail(email)) {
                setEmailError("Некорректный email");
                isValid = false;
            } else {
                setEmailError("");
            }

            if (password === "") {
                setPasswordError("Пустое поле");
                isValid = false;
            } else if (password.length < 3) {
                setPasswordError("Короткий пароль");
                isValid = false;
            } else {
                setPasswordError("");
            }

            setFormError(!isValid);
        };

        validate(email, password);
    }, [email, password]);


    useEffect(() => {
        clearValidation();
    }, []);
    console.log(password)
    return (
        <div className="authorization">
            <h1 className="authorization__title">Авторизация</h1>
            <form className="form-auth" noValidate>
                <label className="popup__form-label">
                    <input value={email}
                           className={emailError ? "form__input_type_error" : ""}
                           onChange={e => setEmail(e.target.value)}
                           type="email"
                           placeholder="Введите email..."
                           id="email-input"
                           required
                    />
                    <span className="form__input-error email-input-error">{emailError}</span>
                </label>
                <label className="popup__form-label">
                    <input value={password}
                           className={passwordError ? "form__input_type_error" : ""}
                           onChange={e => setPassword(e.target.value)}
                           type="password"
                           placeholder="Введите пароль..."
                           id="password-input"
                           required
                    />
                    <span className="form__input-error password-input-error">{passwordError}</span>
                </label>
                <button style={{ backgroundColor: formError ? "#ccc" : "" }}
                        disabled={formError}
                        className="button-auth authorization__btn"
                        onClick={singIn}
                >{load ? "Войти" : "Загрузка"}</button>
            </form>
        </div>
    );
});

export default Authorization;