import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import userStore from './store/userStore'
import fileStore from "./store/fileStore";
import uploaderStore from "./store/uploaderStore";

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        user: new userStore(),
        file: new fileStore(),
        upload: new uploaderStore(),
    }}>
        <App />
    </Context.Provider>
);
