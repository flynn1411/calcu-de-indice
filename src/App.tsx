import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {v4 as uuidv4} from 'uuid';
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
import ObjMateria from './interfaces/materia';

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
const TIMEOUT_VALUE: number = 500;

let backupClases: Array<ObjMateria> = JSON.parse(`${localStorage.getItem(materiasKey)}`);
let backupCambios: String | null = localStorage.getItem(cambiosKey);

const listaClases: Array<ObjMateria> = backupClases != null ? backupClases : defaultTemplate;
const ULTIMOS_CAMBIOS: String | undefined = backupCambios != null ? backupCambios : "nunca";


/*#################Aplicación Principal###################*/
function App(){
    function crearID(): string{
        return uuidv4();
    }

    /*#################Constantes###################*/
    const [materias, setMaterias] = useState<ObjMateria[]>( listaClases.map((materia: ObjMateria)=>{
        return {"id":crearID(), "Clase":materia.Clase, "Nota":materia.Nota, "UV":materia.UV}
    }) );

    const [modalidad, setModalidad] = useState<string>(tipoIndice);
    const [ultimosCambios, setUltimosCambios] = useState<string>(`${ULTIMOS_CAMBIOS}`);
    const [cantidadMaxima, setCantidadMaxima] = useState<number>(maxCantidad);
    const [temaActual, setTemaActual] = useState<string>(document.body.className);
    const [viewModal, setViewModal] = useState<boolean>(false);
    const [showResultados, setShowResultados] = useState<boolean>(false);
    const [cambioPagina, setCambioPagina] = useState<boolean>(false);
    const [saving, setSavingState] = useState<boolean>(false);

    const auth = firebase.auth();
    const firestore = firebase.firestore();
    const [user] = useAuthState(auth);
    var timeoutId: NodeJS.Timeout | null = null;

    /*if(user && navigator.onLine){
        checkAuthedUser();
    }*/
    /*#################Referencias#################*/
    //const refCambios = useRef();

    /*#################Funciones###################*/
    /*function mostrarResultados(){
        setShowResultados(true);
    }*/

    function ocultarResultados(){
        setShowResultados(false);
    }


    function guardarEnStorage(nuevasMaterias: Array<ObjMateria>):void{
        localStorage.setItem(materiasKey, JSON.stringify(nuevasMaterias.map((materia: ObjMateria) => {return {
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
                global: JSON.parse(`${localStorage.getItem(indiceGlobal.llaveStorage)}`),
                periodo: JSON.parse(`${localStorage.getItem(indicePeriodo.llaveStorage)}`),
                "lastModified-global": localStorage.getItem(indiceGlobal.llaveCambios),
                "lastModified-periodo": localStorage.getItem(indicePeriodo.llaveCambios)
            }, {merge: true}
            ).then( () => {
                console.log("Success");
            }
            ).catch( error => {
                console.log(error);
            });
        }, 5000);
    }

    function autoSaving(id: string | null, nuevaMateria: ObjMateria | null, dato?: string){
        let time = new Date();

        let refCambios = document.getElementById("cambios") as HTMLParagraphElement;

        if(refCambios) refCambios.innerHTML = "Guardando...";

        if (timeoutId) clearTimeout(timeoutId);

        setSavingState(true);
        timeoutId = setTimeout(() => {
            manejarCambiosMateria(id, nuevaMateria, dato)

            let minutes: any = time.getMinutes();

            if(minutes < 10) minutes = "0" + minutes;

            const timeStamp = `${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()} ${time.getHours()}:${minutes}`;
            refCambios.innerHTML = `Últimos Cambios Realizados: ${timeStamp}`;
            setUltimosCambios(timeStamp);
            localStorage.setItem(cambiosKey, timeStamp);

            if(user) autoSaveFirebase();
            setSavingState(false);
        }, TIMEOUT_VALUE);

    }

    //Realiza cambios en el estado de las clases
    function manejarCambiosMateria(id: string | null, nuevaMateria: ObjMateria | null, dato?: String){

        if (id === null && nuevaMateria === null) return

        else if (nuevaMateria !== null){
            const nuevasMaterias = [...materias] as ObjMateria[];
            const materiaEncontrada = nuevasMaterias.find(materia => materia.id === id) as ObjMateria;
    
            switch (dato) {
                case "Clase":                
                    materiaEncontrada.Clase = nuevaMateria.Clase;
                    break;
    
                case "Nota":
                    materiaEncontrada.Nota = nuevaMateria.Nota;
                    break;
    
                case "UV":
                    materiaEncontrada.UV = nuevaMateria.UV;
                    break;
    
                default:
                    break;
            }
    
            //console.log(nuevasMaterias);
            setMaterias(nuevasMaterias);
            guardarEnStorage(nuevasMaterias);
        }
    }

    //devuleve el tipo de indice para el titulo
    function getTipo(): string{
        return modalidad === "GLOBAL" ? "Global":"de Periodo";
    }

    function closeModal(): void{
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
    function cambiarModalidad(dato: string | null){
        let nuevaModalidad: any = modalidad;

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
    
            backupClases = JSON.parse(`${localStorage.getItem(materiasKey)}`);
            backupCambios = localStorage.getItem(cambiosKey);
    
            setMaterias((backupClases != null ? backupClases : nuevaModalidad.default).map((materia: { Clase: String; Nota: number; UV: number; })=>{
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
    function agregarGlobal(): void{
        let clasesPeriodo = [...materias].map(clase => {
            return {
                "Clase": clase.Clase,
                "Nota": clase.Nota,
                "UV": clase.UV
            }
        });

        let clasesGlobal = JSON.parse(`${localStorage.getItem(indiceGlobal.llaveStorage)}`);

        if(clasesGlobal === null){
            localStorage.setItem(indiceGlobal.llaveStorage, JSON.stringify(clasesPeriodo));
        }else{
            for(let i=0; i<clasesPeriodo.length; i++){
                clasesGlobal.push(clasesPeriodo[i]);
            }
            localStorage.setItem(indiceGlobal.llaveStorage, JSON.stringify(clasesGlobal));
        }
        
        cambiarModalidad(null);

        setTimeout(()=>{
            let elementoClases = document.getElementById("clases") as HTMLDivElement;

            if(window.innerWidth <= 600){
                elementoClases.scrollIntoView({ block: 'end',  behavior: 'smooth' });
            }else{
                elementoClases.scrollIntoView({ block: 'end',  behavior: 'smooth' });
            }

        },1500);
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
                    //refCambios={refCambios}
                    agregarGlobal={agregarGlobal}
                    firebase={firebase}
                    auth={auth}
                    user={user}
                    temaActual={temaActual}
                    setTemaActual={setTemaActual}
                    //showResultados={showResultados}
                    //mostrarResultados={mostrarResultados}
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

            {localStorage.getItem("informed") ? null : mostrarMensaje()}
        </>
    );
}

export default App;