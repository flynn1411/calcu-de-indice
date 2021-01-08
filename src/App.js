import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import uuidv4 from 'uuid/dist/v4';
import indiceGlobal from './profiles/global';
import indicePeriodo from './profiles/periodo';
import firebase from 'firebase/app';
import 'firebase/firebase-firestore';
import 'firebase/firebase-auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import Contenido from './components/Contenido';
import Navegacion from './components/Navegacion';
//import {useSpring, animated} from 'react-spring';
import Modal from './components/Modal';


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
document.body.className = currentTheme != null? currentTheme:"light";

let indiceActual = localStorage.getItem("tipoIndice");
const tipoIndice = indiceActual != null ? indiceActual:"GLOBAL";

let infoIndice = tipoIndice === "GLOBAL" ? indiceGlobal : indicePeriodo;
let materiasKey = infoIndice.llaveStorage;
let cambiosKey = infoIndice.llaveCambios;
let defaultTemplate = infoIndice.default;
let maxCantidad = infoIndice.cantidadMaxima;

/*#################Variables Globales###################*/
const TIMEOUT_VALUE = 800;

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
    const [temaActual, setTemaActual] = useState(document.body.className);
    const [viewModal, setViewModal] = useState(false);
    const [showResultados, setShowResultados] = useState(false);
    const [cambioPagina, setCambioPagina] = useState(false);
    const [saving, setSavingState] = useState(false);

    const auth = firebase.auth();
    const firestore = firebase.firestore();
    const [user] = useAuthState(auth);
    var timeoutId = null;

    /*if(user && navigator.onLine){
        checkAuthedUser();
    }*/
    /*#################Referencias#################*/
    const refCambios = useRef();

    /*#################Funciones###################*/
    function mostrarResultados(){
        setShowResultados(true);
    }

    function ocultarResultados(){
        setShowResultados(false);
    }


    function guardarEnStorage(nuevasMaterias){
        localStorage.setItem(materiasKey, JSON.stringify(nuevasMaterias.map(materia => {return {
            "Clase": materia.Clase,
            "Nota": materia.Nota,
            "UV": materia.UV
        }})));
    }

    /* Inicio de Funciones Firebase
    if(user){
        console.log(user.uid);
    }
     Fin de Funciones Firebase*/

    function autoSaveFirebase(){
        let timeoutID;

        if(timeoutID) clearTimeout(timeoutID);

        timeoutID = setTimeout(() => {
            firestore.collection("notas").doc(user.uid).set({
                global: JSON.parse(localStorage.getItem(indiceGlobal.llaveStorage)),
                periodo: JSON.parse(localStorage.getItem(indicePeriodo.llaveStorage)),
                "lastModified-global": localStorage.getItem(indiceGlobal.llaveCambios),
                "lastModified-periodo": localStorage.getItem(indicePeriodo.llaveCambios)
            }, {merge: true}
            ).then( () => {
                console.log("Success");
            }
            ).catch( error => {
                console.log(error);
            });
        }, 10000);
    }

    function autoSaving(id, nuevaMateria){
        let time = new Date();

        refCambios.current.innerText = "Guardando...";

        if (timeoutId) clearTimeout(timeoutId);

        setSavingState(true);
        timeoutId = setTimeout(() => {
            manejarCambiosMateria(id, nuevaMateria)

            let minutes = time.getMinutes();

            if(minutes < 10) minutes = "0" + minutes;

            const timeStamp = `${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()} ${time.getHours()}:${minutes}`;
            refCambios.current.innerText = `Últimos Cambios Realizados: ${timeStamp}`;
            setUltimosCambios(timeStamp);
            localStorage.setItem(cambiosKey, timeStamp);

            if(user) autoSaveFirebase();
            setSavingState(false);
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

    //devuleve el tipo de indice para el titulo
    function getTipo(){
        return modalidad === "GLOBAL" ? "Global":"de Periodo";
    }

    function closeModal(){
        setViewModal(false);
    }

    function cerrarResultados(){
        let contenedor = document.getElementById("resultados");

        if(contenedor !== null){
            if(contenedor.children[0]) ReactDOM.unmountComponentAtNode(contenedor);
            ocultarResultados();
        }
    }

    //cambia el tipo de indice que se utiliza
    function cambiarModalidad(dato = null){
        let nuevaModalidad = modalidad;

        if(dato !== null){
            nuevaModalidad = dato === "GLOBAL" ? indiceGlobal: indicePeriodo;
        }else{
            nuevaModalidad = nuevaModalidad === "GLOBAL" ? indicePeriodo: indiceGlobal;
        }

        if(modalidad !== nuevaModalidad.tipoIndice){
            setCambioPagina(true);

            setModalidad(nuevaModalidad.tipoIndice);
    
            if(showResultados){
                cerrarResultados();
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

            setTimeout(()=>{
                setCambioPagina(false);
            } , 15)
    
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

        let nClases = 0;
        let clasesGlobal = JSON.parse(localStorage.getItem(indiceGlobal.llaveStorage));

        if(clasesGlobal === null){
            localStorage.setItem(indiceGlobal.llaveStorage, JSON.stringify(clasesPeriodo));
        }else{
            nClases = clasesPeriodo.length;

            for(let i=0; i<clasesPeriodo.length; i++){
                clasesGlobal.push(clasesPeriodo[i]);
            }
            localStorage.setItem(indiceGlobal.llaveStorage, JSON.stringify(clasesGlobal));
        }
        
        cambiarModalidad();

        if(nClases > 0){
            let tableBody = document.getElementById("datos").tBodies[0].childNodes;

            for(let i=0; i<nClases; i++){
                tableBody[(tableBody.length-nClases+i)].style.backgroundColor = "var(--hover-bg)";
            }
        }

        setTimeout(()=>{
            if(window.innerWidth <= 600){
                document.getElementById("clases").scrollIntoView({ block: 'end',  behavior: 'smooth' });
            }else{
                document.getElementById("clases").scrollIntoView({ block: 'end',  behavior: 'smooth' });
            }

        },1500);
    }

    function reloadPage(){
        if(localStorage.getItem("informed")) localStorage.removeItem("informed");
        window.location.reload();
    }

    function mostrarMensaje(){

        let newHeader = (<>
        <h2>Versión 2.0</h2>
        </>);

        let newMessage = (<>
        <div id="list-item">
            <ul>
                <li>Nueva interfaz</li>
                <li>Ahora todo se realizó en ReactJS y no VanillaJS (mas sencillo de mantener y escalar).</li>
                <li>Opción de agregar clases del índice de periodo al global.</li>
            </ul>
        </div>
        </>);

        let closeModal2 = () =>{
            localStorage.setItem("informed", "true");
            window.location.reload();
    };

        console.log("instalado");

        return (<Modal 
            closeModal={closeModal2}
            temaActual={temaActual}
            message={
                {
                    "header":newHeader,
                    "content":newMessage
                }
            }
        />);
    }

    /************************************************ANIMACIONES*******************************************************/


    return (
        <>
            <>
            {viewModal ? <Modal closeModal={closeModal} temaActual={temaActual} message={null}/> : null}
            </>
            
            <div  id="contenedor-pagina">
                { cambioPagina ? null : (
                <Contenido 
                    materias={materias}
                    setMaterias={setMaterias}
                    setUltimosCambios={setUltimosCambios}
                    crearID={crearID}
                    ultimosCambios={ultimosCambios} 
                    cantidadMaxima={cantidadMaxima}
                    tipoIndice={modalidad}
                    getTipo={getTipo}
                    guardarEnStorage={guardarEnStorage}
                    autoSaving={autoSaving}
                    refCambios={refCambios}
                    agregarGlobal={agregarGlobal}
                    firebase={firebase}
                    auth={auth}
                    user={user}
                    temaActual={temaActual}
                    setTemaActual={setTemaActual}
                    showResultados={showResultados}
                    mostrarResultados={mostrarResultados}
                    modalidad={modalidad}
                    firestore={firestore}
                    saving={saving}
                />
                ) }
            </div>
            
            <Navegacion
            cambiarModalidad={cambiarModalidad}
            tipoIndice={modalidad}
            temaActual={temaActual}
            setViewModal={setViewModal}
            />

            <div id="newUpdate">
                <strong id="texto">¡Nueva actualización disponible! Recarga la pagína para poder ver los cambios.</strong>
                <button id="aceptar" onClick={
                    () => {
                        reloadPage();
                    }
                }>Recargar</button>
                <button id="cerrar" onClick={
                    () => {
                        let snackbar = document.querySelector('#newUpdate');

                        if (snackbar){
                            snackbar.style.display = "none";
                        }
                    }
                }>X</button>
            </div>

            {localStorage.getItem("informed") ? null : mostrarMensaje()}
        </>
    );
}

export default App;