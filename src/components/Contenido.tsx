import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Materias from './Materias';
import Resultados from './Resultados';
import SignedIn from './SignedIn';
import SignedOut from './SignedOut';
import { useSpring, animated } from 'react-spring';
import indiceGlobal from '../profiles/global';
import indicePeriodo from '../profiles/periodo';
import ObjMateria from '../interfaces/materia';
import firebase from 'firebase/app';

interface contenidoProps{
    materias: Array<ObjMateria>;
    setMaterias: (newMaterias: Array<ObjMateria>) => void;
    crearID: () => string;
    tipoIndice: string;
    getTipo: ()=>string;
    ultimosCambios: string;
    setUltimosCambios: (cambios: string) => void;
    cantidadMaxima: number;
    guardarEnStorage: (nuevasMaterias: ObjMateria[]) => void;
    autoSaving: (id: string | null, nuevaMateria: ObjMateria | null, dato?: string) => void;
    agregarGlobal: () => void;
    firebase: firebase.app.App;
    firestore: firebase.firestore.Firestore;
    auth: firebase.auth.Auth;
    user: firebase.User;
    temaActual: string;
    setTemaActual: (nuevoTema: string) => void;
    modalidad: string;
    saving: boolean;
};

export default function Contenido( {
    materias,
    setMaterias,
    crearID,
    tipoIndice,
    getTipo,
    ultimosCambios,
    setUltimosCambios,
    cantidadMaxima,
    guardarEnStorage,
    autoSaving,
    //refCambios,
    agregarGlobal,
    firebase,
    firestore,
    auth,
    user,
    temaActual,
    setTemaActual,
    //mostrarResultados,
    modalidad,
    saving
}: contenidoProps ) {
    
    let tempIndex;
    
    switch (temaActual) {
        case "dark":
            tempIndex = 1;
            break;
            
            case "synthwave":
                tempIndex = 2;
                break;
                default:
                    tempIndex = 0;
                    break;
                }

    const [temaIndex, setTemaIndex] = useState(tempIndex);

    const animacionCambios = useSpring({
        from:{opacity: 0},
        to:{opacity: 1},
        config:{
            tension: 69,
            friction: 1,
            velocity: 9
          }
    });

    const periodoSpawn = {
        "width": "34vw",
        "height": "1vh",
        "bottom": "9vh",
        "position": "absolute",
        "right": "2vw"
    };

    const globalSpawn = {
        "width": "34vw",
        "height": "1vh",
        "bottom": "9vh",
        "position": "absolute",
        "right": "35vw"
    };

    let spawnActual = tipoIndice === "GLOBAL" ? globalSpawn:periodoSpawn;

    const animacionDesktop = useSpring({
        from:{
            width: spawnActual.width,
            height: spawnActual.height,
            opacity: 0.2,
            right: spawnActual.right,
            bottom: spawnActual.bottom,
            borderRadius: "50%"
        },
        to:{
            width: "95vw",
            height: "85vh",
            opacity: 1,
            right: "2.5vw",
            bottom: "13.5vh",
            borderRadius: "0%"
        },
        config: {
            mass: 2,
            tension: 207,
            friction: 40,
            clamp: true,
            velocity: 2
        }
    });

    const animacionMobile = useSpring({
        from:{
            height: "1vh",
            opacity: 0,
            top: "86vh"/*,
            right: "1vw",
            width: "37vw"*/
        },
        to:{
            height: "85vh",
            opacity: 1,
            top: "1.5vh"/*,
            width: "95vw",
            right: "2.5vw"*/
        },
        config:{
            velocity: 19
          }
    });

    function mensajeClases(){
        if(tipoIndice === "GLOBAL"){
            return "Ingresar el total de clases cursadas (incluyendo reprobadas o NSP):";
        }else{
            return "Ingresar todas las clases cursadas en el periodo.";
        }
    }
    
    //Elimina Clases
    function eliminarClases(e=null){
        if (materias.length === 1) return

        //document.getElementById("datos").tBodies[0].lastElementChild.style.maxHeight = "0";

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

    //cambiar temas
    function cambiarTema(e: Event){
        const temas = ["light", "dark", "synthwave"];
        let newTemaIndex = temaIndex;

        /*document.body.className = document.body.className==="light" ? "dark":"light";*/

        document.body.className = temas[newTemaIndex++ % temas.length];
        setTemaIndex(newTemaIndex++);
        localStorage.setItem("currentTheme", document.body.className);
        setTemaActual(document.body.className);
    }

    //Función que realiza el calculo del indice academico
    function calcularIndice(currentMaterias: ObjMateria[]){
        //console.log(currentMaterias);   

        let uvLlenas = true;

        for(let i=0; i<currentMaterias.length; i++){
            //console.log(currentMaterias[i])
            if(currentMaterias[i].UV === 0){
                uvLlenas = false;
                break
            }
        }
        

        if(uvLlenas){
            ReactDOM.render(
            <Resultados
            materias={currentMaterias}
            tipoIndice={tipoIndice}
            getTipo={getTipo}
            agregarAlGlobal={agregarGlobal}
            temaActual={temaActual}
            />,
            document.getElementById("resultados")
            );
            //mostrarResultados();
        }else{
            alert('Ocupas llenar por lo menos todas las casillas de "UV". Las casillas de notas sin llenar se tomarán como "NSP".')
        }
    }

    function manejarAuth(authedUser: firebase.User){

        var referencia = firestore.collection("usuarios").doc(authedUser.uid);

        referencia.get().then( respuesta => {
            //console.log(retrieved.data());
            if(respuesta.exists){
                let datos = respuesta.data() as Object | undefined;

                localStorage.setItem("currentTheme", datos["currentTheme"]);
                setTemaActual(`${localStorage.getItem("currentTheme")}`);
                document.body.className = `${datos["currentTheme"]}`;

                firestore.collection("notas").doc(authedUser.uid).get().then(
                    respuesta => {
                        if(respuesta.exists){
                            let datosRespuesta = respuesta.data();
                            let datosGlobal = datosRespuesta["global"] ? datosRespuesta["global"] : indiceGlobal.default;
                            let datosPeriodo = datosRespuesta["periodo"] ? datosRespuesta["periodo"] : indicePeriodo.default;
                            
                            localStorage.setItem(indiceGlobal.llaveStorage, JSON.stringify(datosGlobal));
                            localStorage.setItem(indicePeriodo.llaveStorage, JSON.stringify(datosPeriodo));

                            if(datosRespuesta["lastModified-global"]){
                                localStorage.setItem(indiceGlobal.llaveCambios, datosRespuesta["lastModified-global"]);
                            }

                            if(datosRespuesta["lastModified-periodo"]){
                                localStorage.setItem(indicePeriodo.llaveCambios, datosRespuesta["lastModified-periodo"]);
                            }

                            if(modalidad === "GLOBAL" && localStorage.getItem(indiceGlobal.llaveCambios)){
                                setUltimosCambios(localStorage.getItem(indiceGlobal.llaveCambios));
                            }else if(localStorage.getItem(indicePeriodo.llaveCambios)){
                                setUltimosCambios(localStorage.getItem(indicePeriodo.llaveCambios));
                            }

                            let modalidadActual = modalidad === "GLOBAL" ? datosGlobal : datosPeriodo;
                            setMaterias(modalidadActual.map( clase => {
                                return {"id":crearID(), "Clase":clase.Clase, "Nota":clase.Nota, "UV":clase.UV}
                            }))
                        }
                    }
                ).catch( error => {
                    console.log(error);
                });
            }else{
                firestore.collection("usuarios").doc(authedUser.uid).set({
                    nombre : `${authedUser.displayName}`,
                    correo : `${authedUser.email}`,
                    correoVerificado : `${authedUser.emailVerified}`,
                    id : `${authedUser.uid}`,
                    "visibility" : "public",
                    currentTheme : localStorage.getItem("currentTheme")
                }, {merge: true}
                ).then( () => {
                    console.log("Success");
                }
                ).catch( error => {
                    console.log(error);
                });
            }
        } ).catch();
    }

    function googleAuth(){
        const provider = new firebase.auth.GoogleAuthProvider();

        auth.signInWithPopup(provider).then( resultado => manejarAuth(resultado.user) );
    }

    function cerrarSesion(){
        auth.signOut().then(event => {
            localStorage.clear();
            window.location.reload();
        });
    }

    return (
        <animated.div style={ window.innerWidth > 600 ? animacionDesktop : animacionMobile} id="pagina">
            <div id="titulo">
                <h1>
                    <strong>Índice {getTipo()}</strong>
                </h1>
            </div>
            <div id="controles">
                <h4>
                    {mensajeClases()}
                </h4>
                <div id="spinner">
                    <table id="tabla-spinner">
                        <tbody>
                            <tr>
                                <td className={"clickable"} onClick={eliminarClases}>
                                    <button>-</button>
                                </td>
                                <td>
                                    <input id="contenidoClases" type="number" min="1" max={cantidadMaxima} readOnly={true} /*onChange={cambiarClases} defaultV*/ value={materias.length}/>
                                </td>
                                <td className={"clickable"} onClick={agregarClases}>
                                    <button>+</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p id="changes" style={animacionCambios}>Últimas módificaciones: {ultimosCambios}</p>
            </div>
            <div id="main-content">
                <div id="clases">
                    <Materias materias={materias} autoSaving={autoSaving} temaActual={temaActual}/>
                </div>
                <div id ="lateral">
                    <div id="temas">
                        {user ? <SignedIn cerrarSesion={cerrarSesion} usuario={user}/>: <SignedOut googleAuth={googleAuth} />}
                        <h4>Tema Actual:</h4>
                        <img className={"hvr-bounce-in"} id="temaActual" src={`resources/${temaActual}.png`} alt={`${temaActual}`} onClick={cambiarTema}/>
                    </div>
                    <br/>
                    <div id="accionCalcular">
                        <button className={saving? "notAvailable":"hvr-ripple-out"} id="calcular" onClick={() => {
                            //console.log(materias);
                            saving ? console.log("Guardando") : calcularIndice(materias)
                        }}>Calcular Indice {getTipo()}</button>
                        <div id="resultados"></div>
                    </div>
                    
                </div>
            </div>
        </animated.div>
    )
}
