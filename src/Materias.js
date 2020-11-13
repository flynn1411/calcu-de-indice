import React from 'react'
import Materia from './Materia'
import uuidv4 from 'uuid/dist/v4'

export default function Materias( {materias, autoSaving} ) {

    function mostrarMaterias(){
        return materias.map( materia => {
            return <Materia key={materia.id} materia={materia} autoSaving={autoSaving}/>
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
                {mostrarMaterias()}
            </tbody>
        </table>
    )
}