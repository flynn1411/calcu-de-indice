import React from 'react';
import Materia from './Materia';
//import uuidv4 from 'uuid/dist/v4'

export default function Materias( {materias, autoSaving, temaActual} ) {

    function mostrarMaterias(){
        return materias.map( materia => {
            return <Materia key={materia.id} materia={materia} autoSaving={autoSaving} temaActual={temaActual}/>
        } )
    }

    return (
        <table id="datos">
            <thead>
                <tr>
                    <th>Clase</th>
                    <th>Nota</th>
                    <th>UV</th>
                </tr>
            </thead>
            <tbody>
                {
                mostrarMaterias()        
                }
            </tbody>
        </table>
    )
}
