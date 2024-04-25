import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import userStore from './store/userStore'
import fileStore from "./store/fileStore";
import uploaderStore from "./store/uploaderStore";
import loaderStore from "./store/loaderStore";

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        user: new userStore(),
        file: new fileStore(),
        upload: new uploaderStore(),
        loader: new loaderStore(),
    }}>
        <App />
    </Context.Provider>
);
