import React, { useState, useRef } from 'react';
import Materias from './Materias';
import uuidv4 from 'uuid/dist/v4';

/*#################Variables Globales###################*/
const listaClases = [{"Clase":"Conta","Nota":70,"UV":4},{"Clase":"Lenguajes","Nota":66,"UV":4}];

/*#################FAplicación Principal###################*/
function App(){
    function crearID(){
        return uuidv4();
    }

    /*#################Constantes###################*/
    const [materias, setMaterias] = useState( listaClases.map((materia)=>{
        return {"id":crearID(), "Clase":materia.Clase, "Nota":materia.Nota, "UV":materia.UV}
    }) );
    const maxLength = 7;
    const refCantidad = useRef();

    /*#################Funciones###################*/
    //Realiza cambios en el estado de las clases
    function manejarCambiosMateria(id, nuevaMateria){
        const nuevasMaterias = [...materias];
        const materia = nuevasMaterias.find(materia => materia.id === id);
        materia.Clase = nuevaMateria.Clase;
        materia.Nota = nuevaMateria.Nota;
        materia.UV = nuevaMateria.UV;

        //console.log(nuevasMaterias);
        setMaterias(nuevasMaterias);
    }

    //Elimina Clases
    function eliminarClases(e=null){
        if (materias.length === 1) return

        const nuevasMaterias = [...materias].slice(0, materias.length-1);

        setMaterias(nuevasMaterias);
    }

    //Agrega Clases
    function agregarClases(e=null){
        if (materias.length === maxLength) return

        const nuevasMaterias = [...materias, {id: crearID(),"Clase":`Clase${materias.length+1}`,"Nota":0,"UV":0}];
        console.log(nuevasMaterias);

        setMaterias(nuevasMaterias);
    }

    //Agregar Clases de manera dinamica
    function cambiarClases(e){
         let nodo = refCantidad.current;
    }

    return (
        <>
            <div>Indice Academico Global</div>
            <div>
                <button onClick={eliminarClases}>-</button>
                <input type="number" min="1" max={maxLength} ref={refCantidad} onChange={cambiarClases}/>
                <button onClick={agregarClases}>+</button>
            </div>
            <Materias materias={materias} manejarCambiosMateria={manejarCambiosMateria}/>
        </>
    );
}

export default App;