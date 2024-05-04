import React, {useState, useEffect, useContext} from 'react';
import './adminPanel.css'
import {observer} from "mobx-react-lite";
import {deleteUser, getUsers, registration} from "../../../http/user";
import {Context} from "../../../index";
import {GENERAL_USER_NAME} from "../../navbar/generalConst";

const AdminPanel = observer(() => {
    const {user} = useContext(Context)
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [nameError, setNameError] = useState("")
    const [surnameError, setSurnameError] = useState("")
    const [emailAdm, setEmailAdm] = useState("")
    const [passwordAdm, setPasswordAdm] = useState("")
    const [emailErrorAdm, setEmailErrorAdm] = useState("")
    const [passwordErrorAdm, setPasswordErrorAdm] = useState("")
    const [formErrorAdm, setFormErrorAdm] = useState(false)
    const [deleteEmail, setDeleteEmail] = useState("")
    const [deleteEmailErrorAdm, setDeleteEmailErrorAdm] = useState("")
    const [formErrorAdmDelete, setFormErrorAdmDelete] = useState(true)
    const [load, setLoad] = useState(true)
    const [loadDel, setLoadDel] = useState(true)
    const [users, setUsers] = useState([])
    const [loadUsers, setLoadUsers] = useState(true)

    function registrationHandler(evt) {
        setLoad(false)
        evt.preventDefault()
        registration(emailAdm, passwordAdm, name, surname)
            .then(r => {
                console.log(r)
                setLoad(true)
                alert("Создан новый пользователь")
                setName("")
                setSurname("")
                setEmailAdm("")
                setPasswordAdm("")
            })
            .catch(e => {
                alert(e.response.data.message)
                setLoad(true)
            })
    }

    const validEmailAdm = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const clearValidation = () => {
        setEmailErrorAdm("")
        setPasswordErrorAdm("")
        setNameError("")
        setSurnameError("")
        setFormErrorAdm(true)
    }

    useEffect(() => {
        const validate = (name, surname, emailAdm, passwordAdm) => {
            let isValid = true;

            if (name === "") {
                setNameError("Пустое поле");
                isValid = false;
            } else {
                setNameError("");
            }

            if (surname === "") {
                setSurnameError("Пустое поле");
                isValid = false;
            } else {
                setSurnameError("");
            }

            if (emailAdm === "") {
                setEmailErrorAdm("Пустое поле");
                isValid = false;
            } else if (!validEmailAdm(emailAdm)) {
                setEmailErrorAdm("Некорректный email");
                isValid = false;
            } else {
                setEmailErrorAdm("");
            }

            if (passwordAdm === "") {
                setPasswordErrorAdm("Пустое поле");
                isValid = false;
            } else if (passwordAdm.length < 3) {
                setPasswordErrorAdm("Короткий пароль");
                isValid = false;
            } else {
                setPasswordErrorAdm("");
            }

            setFormErrorAdm(!isValid);
        };

        validate(name, surname, emailAdm, passwordAdm);
    }, [name, surname, emailAdm, passwordAdm]);

    useEffect(() => {
        clearValidation();
    }, []);

    useEffect(() => {
        if (deleteEmail === '') {
            setDeleteEmailErrorAdm("Пустое поле")
            setFormErrorAdmDelete(true)
        }else if (!validEmailAdm(deleteEmail)) {
            setDeleteEmailErrorAdm("Некорректный email")
            setFormErrorAdmDelete(true)
        } else if (deleteEmail === user.user.email) {
            setDeleteEmailErrorAdm("Вы не можете себя удалить")
            setFormErrorAdmDelete(true)
        } else if (deleteEmail === GENERAL_USER_NAME) {
            setDeleteEmailErrorAdm("Вы не можете удалить общее пространство")
            setFormErrorAdmDelete(true)
        } else {
            setDeleteEmailErrorAdm("")
            setFormErrorAdmDelete(false)
        }
    }, [deleteEmail, user])

    useEffect(() => {
        function clearValidationDelete () {
            setDeleteEmailErrorAdm("")
            setFormErrorAdmDelete(true)
        }
        clearValidationDelete()
    }, []);

    function deleteHandler(evt) {
        setLoadDel(false)
        evt.preventDefault()
        deleteUser(deleteEmail)
            .then(r => {
                alert(r.data.message);
                setLoadDel(true)
                setDeleteEmail("")
            })
            .catch(r => {
                alert(r.response.data.message);
                setLoadDel(true)
            })
        setLoadDel(false)
    }


    function reqUsers() {
        setLoadUsers(false)
        getUsers()
            .then(r => {
                setUsers(r.map(item => item.email))
                setLoadUsers(true)
            })
    }


    return (
        <div className="admin-panel">
            <div className="admin-panel__registration">
                <h1 className="admin-panel__registration__header">Создание пользователя</h1>
                <form className="form-registration" noValidate>
                    <label className="registration__form-label">
                        <input value={name}
                               className={nameError ? "form__input_type_error" : ""}
                               onChange={e => setName(e.target.value)}
                               type="text"
                               placeholder="Введите имя..."
                               id="name-input"
                               required
                        />
                        <span className="form__input-error name-input-error">{nameError}</span>
                    </label>
                    <label className="registration__form-label">
                        <input value={surname}
                               className={surnameError ? "form__input_type_error" : ""}
                               onChange={e => setSurname(e.target.value)}
                               type="text"
                               placeholder="Введите фамилию..."
                               id="surname-input"
                               required
                        />
                        <span className="form__input-error surname-input-error">{surnameError}</span>
                    </label>
                    <label className="registration__form-label">
                        <input value={emailAdm}
                               className={emailErrorAdm ? "form__input_type_error" : ""}
                               onChange={e => setEmailAdm(e.target.value)}
                               type="email"
                               placeholder="Введите email..."
                               id="email-input"
                               required
                        />
                        <span className="form__input-error email-input-error">{emailErrorAdm}</span>
                    </label>
                    <label className="registration__form-label">
                        <input value={passwordAdm}
                               className={passwordErrorAdm ? "form__input_type_error" : ""}
                               onChange={e => setPasswordAdm(e.target.value)}
                               type="password"
                               placeholder="Введите пароль..."
                               id="password-input"
                               required
                        />
                        <span className="form__input-error password-input-error">{passwordErrorAdm}</span>
                    </label>
                    <button style={{ backgroundColor: formErrorAdm ? "#ccc" : "" }}
                            disabled={formErrorAdm}
                            className="button-auth registration__btn"
                            onClick={registrationHandler}
                    >{load ? "Создать" : "Загрузка"}</button>
                </form>
            </div>
            <div className="admin-panel__delete">
                <h1 className="admin-panel__delete__header">Удаление пользователя по почте</h1>
                <form className="form-delete">
                    <label className="registration__form-label">
                        <input value={deleteEmail}
                               className={deleteEmailErrorAdm ? "form__input_type_error" : ""}
                               onChange={e => setDeleteEmail(e.target.value)}
                               type="text"
                               placeholder="Введите email..."
                               id="delete-input"
                               required
                        />
                        <span className="form__input-error delete-input-error">{deleteEmailErrorAdm}</span>
                    </label>
                    <button style={{ backgroundColor: formErrorAdmDelete ? "#ccc" : "" }}
                            disabled={formErrorAdmDelete}
                            className="button-auth registration__btn"
                            onClick={deleteHandler}
                    >{loadDel ? "Удалить" : "Удаление"}</button>
                </form>
            </div>
            <div className="admin-panel__info">
                <button className="button-auth req__btn"
                        onClick={reqUsers}
                >{loadUsers ? "Запросить пользователей" : "Запрос пользователей"}</button>
                <div>
                    {users.map((user, index) => (
                        <div key={index}>{user}</div>
                    ))}
                </div>
            </div>
        </div>
    );
});

export default AdminPanel;