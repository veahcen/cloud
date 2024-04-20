import React, {useContext, useEffect, useState} from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './mainstyle.css'
import NavBar from "./navbar/NavBar"
import './app.css'
import Registration from "./authorization/Registration"
import {REGISTRATION_ROUTE, LOGIN_ROUTE} from '../untils/consts'
import Authorization from "./authorization/Authorization"
import {Context} from "../index"
import {observer} from "mobx-react-lite"
import {check} from "../http/user"


const App = observer(() => {
    const {user} = useContext(Context)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            check()
                .then((data) => {
                    user.setUser(data)
                    user.setIsAuth(true)
                    user.setIsRole(data.role)
                })
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>
    }

    return (
      <BrowserRouter>
          <div className='app'>
              <NavBar/>
              {!user.isAuth &&
                  <Routes>
                      <Route path={REGISTRATION_ROUTE}  element={<Registration />}  />
                      <Route path={LOGIN_ROUTE}  element={<Authorization />}  />
                      <Route
                          path="*"
                          element={<Authorization />}
                      />
                  </Routes>
              }
          </div>
      </BrowserRouter>
  );
})

export default App
