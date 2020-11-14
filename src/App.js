import React, { useState, useRef } from 'react';
import Materias from './Materias';
import uuidv4 from 'uuid/dist/v4';

document.body.className = "default";

/*#################Variables Globales###################*/
const DEFAULT_CAMBIOS_PERIODO = "6/8/2020 13:52";
const DEFAULT_PERIODO = [
    {"Clase":"Conta","Nota":70,"UV":4},
    {"Clase":"Lenguajes","Nota":66,"UV":4}
];
const TIMEOUT_VALUE = 1200;
const CANTIDAD_MAXIMA_PERIODO = 10;

const periodoKey = "MATERIAS_PERIODO";
const changesPeriodoKey = "CAMBIOS_PERIODO";

const backupClases = JSON.parse(localStorage.getItem(periodoKey));
const backupCambios = localStorage.getItem(changesPeriodoKey);

const listaClases = backupClases != null ? backupClases : DEFAULT_PERIODO;
const ULTIMOS_CAMBIOS_PERIODO = backupCambios != null ? backupCambios : DEFAULT_CAMBIOS_PERIODO;


/*#################Aplicación Principal###################*/
function App(){
    function crearID(){
        return uuidv4();
    }

    /*#################Constantes###################*/
    const [materias, setMaterias] = useState( listaClases.map((materia)=>{
        return {"id":crearID(), "Clase":materia.Clase, "Nota":materia.Nota, "UV":materia.UV}
    }) );

    const [tiempoPeriodo, setTiempoPeriodo] = useState(ULTIMOS_CAMBIOS_PERIODO);
    const [cantidadMaxima, setCantidadMaxima] = useState(CANTIDAD_MAXIMA_PERIODO);

    /*#################Referencias#################*/
    const refTiempoPeriodo = useRef();

    /*#################Funciones###################*/
    function autoSaving(id, nuevaMateria){
        let timeoutId, time = new Date();

        refTiempoPeriodo.current.innerText = "Guardando...";

        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            manejarCambiosMateria(id, nuevaMateria)

            let minutes = time.getMinutes();

            if(minutes < 10) minutes = "0" + minutes;

            const timeStamp = `${time.getDate()}/${time.getMonth()}/${time.getFullYear()} ${time.getHours()}:${minutes}`;
            refTiempoPeriodo.current.innerText = `Últimos Cambios Realizados: ${timeStamp}`;
            setTiempoPeriodo(timeStamp);
            localStorage.setItem(changesPeriodoKey, timeStamp);

        }, TIMEOUT_VALUE);
    }

    //Realiza cambios en el estado de las clases
    function manejarCambiosMateria(id, nuevaMateria){
        const nuevasMaterias = [...materias];
        const materiaEncontrada = nuevasMaterias.find(materia => materia.id === id);
        materiaEncontrada.Clase = nuevaMateria.Clase;
        materiaEncontrada.Nota = nuevaMateria.Nota;
        materiaEncontrada.UV = nuevaMateria.UV;

        //console.log(nuevasMaterias);
        setMaterias(nuevasMaterias);
        localStorage.setItem(periodoKey, JSON.stringify(nuevasMaterias));
    }

    //Elimina Clases
    function eliminarClases(e=null){
        if (materias.length === 1) return

        const nuevasMaterias = [...materias].slice(0, materias.length-1);

        setMaterias(nuevasMaterias);
        localStorage.setItem(periodoKey, JSON.stringify(nuevasMaterias));
    }

    //Agrega Clases
    function agregarClases(e=null){
        if (materias.length === cantidadMaxima) return

        const nuevasMaterias = [...materias, {id: crearID(),"Clase":`Clase${materias.length+1}`,"Nota":0,"UV":0}];

        setMaterias(nuevasMaterias);
        localStorage.setItem(periodoKey, JSON.stringify(nuevasMaterias));
    }

    //cambiar temas
    function cambiarTema(e){
        document.body.className = document.body.className==="default" ? "default2":"default";
    }

    return (
        <>
            <div>Indice Academico Global</div>
            <div>
                <button onClick={eliminarClases}>-</button>
                <input type="number" min="1" max={cantidadMaxima} readOnly={true} /*onChange={cambiarClases}*/ value={materias.length}/>
                <button onClick={agregarClases}>+</button>
            </div>
            <div>
                <button onClick={cambiarTema}>Cambiar Color</button>
            </div>
            <div>
                <p ref={refTiempoPeriodo}>Últimos cambios realizados: {tiempoPeriodo}</p>
            </div>
            <Materias materias={materias} autoSaving={autoSaving}/>
        </>
    );
}

export default App;