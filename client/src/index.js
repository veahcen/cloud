import React, {createContext, StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import userStore from './store/userStore'
import fileStore from "./store/fileStore";

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <StrictMode>
        <Context.Provider value={{
            user: new userStore(),
            file: new fileStore(),
        }}>
            <App />
        </Context.Provider>
    </StrictMode>
);
