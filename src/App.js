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
import {useSpring, animated} from 'react-spring';
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
    const [temaActual, setTemaActual] = useState(document.body.className);
    const [viewModal, setViewModal] = useState(false);
    const [showResultados, setShowResultados] = useState(false);
    const [cambioPagina, setCambioPagina] = useState(false);

    const auth = firebase.auth();
    const firestore = firebase.firestore();
    const [user] = useAuthState(auth);

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

    /************************************************ANIMACIONES*******************************************************/


    return (
        <>
            <Modal viewModal={viewModal} closeModal={closeModal}/>
            
            <div  id="contenedor-pagina">
                { cambioPagina ? null : (
                <Contenido 
                    materias={materias}
                    setMaterias={setMaterias}
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
                    firestore={firestore}
                    temaActual={temaActual}
                    setTemaActual={setTemaActual}
                    showResultados={showResultados}
                    mostrarResultados={mostrarResultados}
                    cerrarResultados={cerrarResultados}
                />
                ) }
            </div>
            
            <Navegacion
            cambiarModalidad={cambiarModalidad}
            tipoIndice={modalidad}
            temaActual={temaActual}
            setViewModal={setViewModal}
            />
        </>
    );
}

export default App;