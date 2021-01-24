import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import FirebaseProvider from './FirebaseContext';
//import Modal from './components/Modal'
import './sass/index.scss';
import './sass/hover-min.css';
import '@fortawesome/fontawesome-free'
import * as serviceWorkerRegistrator from './serviceWorkerRegistration';

ReactDOM.render(
    <FirebaseProvider>
        <App/>
        <div id="newUpdate">
                <strong id="texto">¡Nueva actualización disponible! Recarga la pagína para poder ver los cambios.</strong>
                <button id="aceptar">Recargar</button>
                <button id="cerrar" onClick={
                    () => {
                        let snackbar = document.querySelector('#newUpdate') as HTMLDivElement;

                        if (snackbar){
                            snackbar.style.display = "none";
                        }
                    }
                }>X</button>
            </div>
    </FirebaseProvider>,
    document.getElementById('root')
);

serviceWorkerRegistrator.register({ onUpdate: (registration: ServiceWorkerRegistration) =>{
    console.log("Nueva Actualización Disponible");

    let acceptBttn = document.querySelector("#aceptar") as HTMLButtonElement;

    if(acceptBttn){
        acceptBttn.onclick = () => {
            if(registration.waiting !== null){
                registration.waiting.postMessage({type: "SKIP_WAITING"});
            }

            if(localStorage.getItem("informed")) localStorage.removeItem("informed");
            window.location.reload();
        };
    }
    
    let snackBar = document.querySelector("#newUpdate") as HTMLDivElement;

    if(snackBar){
        snackBar.style.display = "grid";
    }
} });