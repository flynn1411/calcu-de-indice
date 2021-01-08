import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//import Modal from './components/Modal'
import './sass/index.scss';
import './sass/hover-min.css';
import * as serviceWorkerRegistrator from './serviceWorkerRegistration';

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorkerRegistrator.register({ onUpdate: (registration) =>{
    console.log("Nueva Actualización Disponible");
    
    let snackBar = document.querySelector("#newUpdate");

    if(snackBar){
        snackBar.style.display = "grid";
    }
} });