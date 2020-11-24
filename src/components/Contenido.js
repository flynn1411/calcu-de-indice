import React from 'react';
import ReactDOM from 'react-dom';
import Materias from './Materias';
import Resultados from './Resultados';
import SignedIn from './SignedIn';
import SignedOut from './SignedOut';

export default function Contenido( {
    materias,
    setMaterias,
    crearID,
    tipoIndice,
    getTipo,
    ultimosCambios,
    cantidadMaxima,
    guardarEnStorage,
    autoSaving,
    refCambios,
    agregarGlobal,
    firebase,
    auth,
    user,
    firestore,
    temaActual,
    setTemaActual,
    showResultados,
    mostrarResultados,
    cerrarResultados
} ) {

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
        const temas = ["light", "dark", "synthwave"];

        /*document.body.className = document.body.className==="light" ? "dark":"light";*/

        document.body.className = temas[Math.floor(Math.random() * temas.length)];
        localStorage.setItem("currentTheme", document.body.className);
        setTemaActual(document.body.className);
    }

    //Función que realiza el calculo del indice academico
    function calcularIndice(){

        if(showResultados){
            cerrarResultados();
        }else{
            mostrarResultados();        

            let uvLlenas = true;

            for(let i=0; i<materias.length; i++){
                if(materias[i].UV === 0){
                    uvLlenas = false;
                    break
                }
            }

            if(uvLlenas){
                ReactDOM.render(<Resultados materias={materias} tipoIndice={tipoIndice} getTipo={getTipo} agregarAlGlobal={agregarGlobal}/>, document.getElementById("resultados"));
            }else{
                alert('Ocupas llenar por lo menos todas las casillas de "UV". Las casillas de notas sin llenar se tomarán como "NSP".')
            }

        }   

    }

    function googleAuth(){
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    function cerrarSesion(){
        auth.signOut();
    }

    return (
        <div id="pagina">
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
                                <td className="clickable" onClick={eliminarClases}>
                                    <button>-</button>
                                </td>
                                <td>
                                    <input id="contenidoClases" type="number" min="1" max={cantidadMaxima} readOnly={true} /*onChange={cambiarClases} defaultV*/ value={materias.length}/>
                                </td>
                                <td className="clickable" onClick={agregarClases}>
                                    <button>+</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p ref={refCambios}>Últimas módificaciones: {ultimosCambios}</p>
            </div>
            <div id="main-content">
                <div id="clases">
                    <Materias materias={materias} autoSaving={autoSaving}/>
                </div>
                <div id ="lateral">
                    <div id="temas">
                        {user ? <SignedIn cerrarSesion={cerrarSesion} usuario={user}/>: <SignedOut googleAuth={googleAuth} />}
                        <h4>Tema Actual:</h4>
                        <img id="temaActual" src={`resources/${temaActual}.png`} alt={`Tema de colores ${temaActual}`} onClick={cambiarTema}/>
                    </div>
                    <br/>
                    <div id="accionCalcular">
                        <button id="calcular" onClick={calcularIndice}>Calcular Indice {getTipo()}</button>
                        <div id="resultados"></div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
