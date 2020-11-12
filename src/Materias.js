import React from 'react'
import Materia from './Materia'
import uuidv4 from 'uuid/dist/v4'

export default function Materias( {materias, manejarCambiosMateria, actualizarMaterias} ) {

    function crearID(){
        return uuidv4();
    }

    function actualizar(){
        mostrarMaterias(materias.map(materia => {materia.id = crearID()}));
    }

    function mostrarMaterias(materias2){
        actualizarMaterias(materias2);

        return materias2.map( materia => {
            
            return <Materia key={materia.id} materia={materia} manejarCambiosMateria={manejarCambiosMateria}/>
        } )
    }

    return (
        <table border="1">
            <thead>
                <tr>
                    <th>Clase</th>
                    <th>Nota</th>
                    <th>UV</th>
                </tr>
            </thead>
            <tbody>
                {actualizar()}
            </tbody>
        </table>
    )
}
