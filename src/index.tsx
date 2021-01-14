import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//import Modal from './components/Modal'
import './sass/index.scss';
import './sass/hover-min.css';
import * as serviceWorkerRegistrator from './serviceWorkerRegistration';

ReactDOM.render(
    <>
        <App/>
        <div id="newUpdate">
                <strong id="texto">¡Nueva actualización disponible! Recarga la pagína para poder ver los cambios.</strong>
                <button id="aceptar">Recargar</button>
                <button id="cerrar" onClick={
                    () => {
                        let snackbar = document.querySelector('#newUpdate');

                        if (snackbar){
                            snackbar.style.display = "none";
                        }
                    }
                }>X</button>
            </div>
    </>,
    document.getElementById('root')
);

serviceWorkerRegistrator.register({ onUpdate: (registration) =>{
    console.log("Nueva Actualización Disponible");

    let acceptBttn = document.querySelector("#aceptar");

    if(acceptBttn){
        acceptBttn.onClick = () => {
            registration?.postMessage({type: "SKIP_WAITING"});

            if(localStorage.getItem("informed")) localStorage.removeItem("informed");
            window.location.reload();
        };
    }
    
    let snackBar = document.querySelector("#newUpdate");

    if(snackBar){
        snackBar.style.display = "grid";
    }
} });