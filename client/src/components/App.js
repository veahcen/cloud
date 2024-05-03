import React, {useContext, useEffect} from "react"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import "./mainstyle.css"
import NavBar from "./navbar/NavBar"
import "./app.css"
import Registration from "./authorization/Registration"
import {REGISTRATION_ROUTE, LOGIN_ROUTE, DISK_ROUTE, PROFILE_ROUTE, ADMIN_ROUTE} from "../untils/consts"
import Authorization from "./authorization/Authorization"
import {Context} from "../index"
import {observer} from "mobx-react-lite"
import {check} from "../http/user"
import Disk from "./disk/Disk";
import Profile from "./disk/profile/Profile";
import AdminPanel from "./disk/profile/AdminPanel";


const App = observer(() => {
    const {user, loader} = useContext(Context)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            check()
                .then((data) => {
                    user.setUser(data)
                    user.setIsAuth(true)
                    user.setIsRole(data.role)
                    user.setAvatar(data.avatar)
                    user.setSpace(data.usedSpace)
                })
                .finally(() => loader.hideLoader())
        } else {
            loader.hideLoader()
        }
    }, [loader, user]);

    if (loader.boolLoader) {
        return (
            <div className="loader">
                <div className="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        )
    }

    return (
      <BrowserRouter>
          <div className="app">
              <NavBar/>
              <div className="container">
                  {!user.isAuth ?
                      <Routes>
                          <Route path={REGISTRATION_ROUTE}  element={<Registration />}  />
                          <Route path={LOGIN_ROUTE}  element={<Authorization />}  />
                          <Route
                              path="*"
                              element={<Authorization />}
                          />
                      </Routes>
                      :
                      user.IsRole === 'ADMIN' ? (
                          <Routes>
                              <Route path={DISK_ROUTE}  element={<Disk />}  />
                              <Route path={PROFILE_ROUTE}  element={<Profile />}  />
                              <Route path={ADMIN_ROUTE}  element={<AdminPanel />}  />
                              <Route
                                  path="*"
                                  element={<Disk />}
                              />
                          </Routes>
                      ) : (
                          <Routes>
                              <Route path={DISK_ROUTE}  element={<Disk />}  />
                              <Route path={PROFILE_ROUTE}  element={<Profile />}  />
                              <Route
                                  path="*"
                                  element={<Disk />}
                              />
                          </Routes>
                      )
                  }
              </div>
          </div>
      </BrowserRouter>
  );
})

export default App
