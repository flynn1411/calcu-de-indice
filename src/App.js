import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import Materias from './Materias';
import Resultados from './Resultados';
import uuidv4 from 'uuid/dist/v4';
import indiceGlobal from './profiles/global';
import indicePeriodo from './profiles/periodo';
import firebase from 'firebase/app';
import 'firebase/firebase-firestore';
import 'firebase/firebase-auth';
import SignedIn from './SignedIn';
import SignedOut from './SignedOut';

import { useAuthState } from 'react-firebase-hooks/auth';

/*********************INICIALIZACIÓN DE FIREBASE***********************/

firebase.initializeApp({
    apiKey: "AIzaSyCrFbPHJizkQbb3IEPf_DyNjwcwZCD7NpM",
    authDomain: "calculadoradeindice.firebaseapp.com",
    databaseURL: "https://calculadoradeindice.firebaseio.com",
    projectId: "calculadoradeindice",
    storageBucket: "calculadoradeindice.appspot.com",
    messagingSenderId: "180634225139",
    appId: "1:180634225139:web:c4300eb226ca6f4db46a86",
    measurementId: "G-7DG9TX7RN9"

});

/*###################Para cuando la pagina carga#######################*/
const currentTheme = localStorage.getItem("currentTheme");
document.body.className = currentTheme != null? currentTheme:"default";

let indiceActual = localStorage.getItem("tipoIndice");
const tipoIndice = indiceActual != null ? indiceActual:"GLOBAL";

let infoIndice = tipoIndice === "GLOBAL" ? indiceGlobal : indicePeriodo;
let materiasKey = infoIndice.llaveStorage;
let cambiosKey = infoIndice.llaveCambios;
let defaultTemplate = infoIndice.default;
let maxCantidad = infoIndice.cantidadMaxima;

/*#################Variables Globales###################*/
const TIMEOUT_VALUE = 1200;

let backupClases = JSON.parse(localStorage.getItem(materiasKey));
let backupCambios = localStorage.getItem(cambiosKey);

const listaClases = backupClases != null ? backupClases : defaultTemplate;
const ULTIMOS_CAMBIOS = backupCambios != null ? backupCambios : "nunca";


/*#################Aplicación Principal###################*/
function App(){
    function crearID(){
        return uuidv4();
    }

    /*#################Constantes###################*/
    const [materias, setMaterias] = useState( listaClases.map((materia)=>{
        return {"id":crearID(), "Clase":materia.Clase, "Nota":materia.Nota, "UV":materia.UV}
    }) );

    const [modalidad, setModalidad] = useState(tipoIndice);
    const [ultimosCambios, setUltimosCambios] = useState(ULTIMOS_CAMBIOS);
    const [cantidadMaxima, setCantidadMaxima] = useState(maxCantidad);

    const auth = firebase.auth();
    const firestore = firebase.firestore();
    const [user] = useAuthState(auth);

    /*#################Referencias#################*/
    const refCambios = useRef();

    /*#################Funciones###################*/
    function guardarEnStorage(nuevasMaterias){
        localStorage.setItem(materiasKey, JSON.stringify(nuevasMaterias.map(materia => {return {
            "Clase": materia.Clase,
            "Nota": materia.Nota,
            "UV": materia.UV
        }})));
    }

    function autoSaving(id, nuevaMateria){
        let timeoutId, time = new Date();

        refCambios.current.innerText = "Guardando...";

        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            manejarCambiosMateria(id, nuevaMateria)

            let minutes = time.getMinutes();

            if(minutes < 10) minutes = "0" + minutes;

            const timeStamp = `${time.getDate()}/${time.getMonth()}/${time.getFullYear()} ${time.getHours()}:${minutes}`;
            refCambios.current.innerText = `Últimos Cambios Realizados: ${timeStamp}`;
            setUltimosCambios(timeStamp);
            localStorage.setItem(cambiosKey, timeStamp);

        }, TIMEOUT_VALUE);
    }

    //Realiza cambios en el estado de las clases
    function manejarCambiosMateria(id, nuevaMateria){

        if (id === null && nuevaMateria === null) return

        const nuevasMaterias = [...materias];
        const materiaEncontrada = nuevasMaterias.find(materia => materia.id === id);
        materiaEncontrada.Clase = nuevaMateria.Clase;
        materiaEncontrada.Nota = nuevaMateria.Nota;
        materiaEncontrada.UV = nuevaMateria.UV;

        //console.log(nuevasMaterias);
        setMaterias(nuevasMaterias);
        guardarEnStorage(nuevasMaterias);
    }

    //Elimina Clases
    function eliminarClases(e=null){
        if (materias.length === 1) return

        const nuevasMaterias = [...materias].slice(0, materias.length-1);

        setMaterias(nuevasMaterias);
        autoSaving(null, null);
        guardarEnStorage(nuevasMaterias);
    }

    //Agrega Clases
    function agregarClases(e=null){
        if (materias.length === cantidadMaxima) return

        const nuevasMaterias = [...materias, {id: crearID(),"Clase":`Clase${materias.length+1}`,"Nota":0,"UV":0}];

        setMaterias(nuevasMaterias);
        autoSaving(null, null);
        guardarEnStorage(nuevasMaterias);
    }

    //cambia clases de acuerdo a como se escriban por el usuario
    /*function cambiarClases(e){
        let nuevaCantidad = parseInt(e.target.value);
        let materiasNuevas = [...materias];

        if(nuevaCantidad > materias.length){
            let diferencia = nuevaCantidad - materias.length;

            for(let i = 0; i<diferencia; i++){
                if(materiasNuevas.length < cantidadMaxima){
                    materiasNuevas.push({id: crearID(),"Clase":`Clase${materias.length+i+1}`,"Nota":0,"UV":0})
                }else{break}
            }
        }
        else if(nuevaCantidad < materias.length){
            let diferencia = materias.length - nuevaCantidad;

            for(let i = 0; i<diferencia; i++){
                if(materiasNuevas.length > 1){
                    materiasNuevas.slice(0, materias.length-i-1);
                }
                else{break}
            }
        }

        setMaterias(materiasNuevas);
    }*/

    //cambiar temas
    function cambiarTema(e){
        document.body.className = document.body.className==="default" ? "default2":"default";
        localStorage.setItem("currentTheme", document.body.className);
    }

    //devuleve el tipo de indice para el titulo
    function getTipo(){
        return modalidad === "GLOBAL" ? "Global":"de Periodo";
    }

    //cambia el tipo de indice que se utiliza
    function cambiarModalidad(dato = null){
        let nuevaModalidad = "";

        if(dato !== null){
            nuevaModalidad = dato === "GLOBAL" ? indiceGlobal: indicePeriodo;
        }else{
            nuevaModalidad = modalidad === "GLOBAL" ? indicePeriodo: indiceGlobal;
        }

        if(modalidad !== nuevaModalidad.tipoIndice){

            setModalidad(nuevaModalidad.tipoIndice);
            let contenedor = document.getElementById("resultados");
    
            if(contenedor !== null){
                if(contenedor.children[0]) ReactDOM.unmountComponentAtNode(contenedor);
            }
    
            materiasKey = nuevaModalidad.llaveStorage;
            cambiosKey = nuevaModalidad.llaveCambios;
    
            backupClases = JSON.parse(localStorage.getItem(materiasKey));
            backupCambios = localStorage.getItem(cambiosKey);
    
            setMaterias((backupClases != null ? backupClases : nuevaModalidad.default).map((materia)=>{
                return {"id":crearID(), "Clase":materia.Clase, "Nota":materia.Nota, "UV":materia.UV}
            }) );
            setUltimosCambios(backupCambios != null ? backupCambios : "nunca");
            setCantidadMaxima(nuevaModalidad.cantidadMaxima);
    
            localStorage.setItem("tipoIndice", nuevaModalidad.tipoIndice);

        }

    }

    //Agrega clases del periodo a las clases globales
    function agregarGlobal(){
        let clasesPeriodo = [...materias].map(clase => {
            return {
                "Clase": clase.Clase,
                "Nota": clase.Nota,
                "UV": clase.UV
            }
        });
        let clasesGlobal = JSON.parse(localStorage.getItem(indiceGlobal.llaveStorage));

        if(clasesGlobal === null){
            localStorage.setItem(indiceGlobal.llaveStorage, JSON.stringify(clasesPeriodo));
        }else{
            for(let i=0; i<clasesPeriodo.length; i++){
                clasesGlobal.push(clasesPeriodo[i]);
            }
            localStorage.setItem(indiceGlobal.llaveStorage, JSON.stringify(clasesGlobal));
        }
        
        cambiarModalidad();
        setTimeout(()=>{
            document.getElementById("calcular").scrollIntoView(true);
        },500);
    }

    //Función que realiza el calculo del indice academico
    function calcularIndice(){
        ReactDOM.render(<Resultados materias={materias} tipoIndice={getTipo()} agregarAlGlobal={agregarGlobal}/>, document.getElementById("resultados"));
    }

    function googleAuth(){
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    function cerrarSesion(){
        auth.signOut();
    }


    return (
        <>
        <div id="pagina">
            <div id="titulo">
                <h1>
                    Indice {getTipo()}
                </h1>
            </div>
            <div id="controles">
                <button onClick={eliminarClases}>-</button>
                <input type="number" min="1" max={cantidadMaxima} readOnly={true} /*onChange={cambiarClases} defaultV*/ value={materias.length}/>
                <button onClick={agregarClases}>+</button>
                <p ref={refCambios}>Últimos cambios realizados: {ultimosCambios}</p>
            </div>
            <div id="main-content">
                <div id="clases">
                    <Materias materias={materias} autoSaving={autoSaving}/>
                </div>
                <div id ="lateral">
                    <button onClick={cambiarTema}>Cambiar Color</button>
                    <br/>
                    <button id="calcular" onClick={calcularIndice}>Calcular Indice {getTipo()}</button>
                    <br/>
                    <div id="resultados"></div>
                    
                    <div>Usuario conectado: {/*user ? <SignedIn cerrarSesion={cerrarSesion} usuario={user}/>: <SignedOut googleAuth={googleAuth} />*/ "nada"}</div>
                </div>
            </div>
        </div>
        <div id="navbar-desktop">
            <div className="dNavItems">info</div>
            <div className="dNavItems">Indice:</div>
            <div className="dNavItems" onClick={() => {cambiarModalidad("GLOBAL")}}>Global</div>
            <div className="dNavItems" onClick={() => {cambiarModalidad("PERIODO")}}>Periodo</div>
        </div>
        </>
    );
}

export default App;