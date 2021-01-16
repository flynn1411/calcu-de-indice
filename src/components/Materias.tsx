import React from 'react';
import Materia from './Materia';
import ObjMateria from '../interfaces/materia';

interface MateriasProp{
    materias: ObjMateria[];
    autoSaving: (id: string | null, nuevaMateria: ObjMateria | null, dato?: string) => void;
    temaActual: string;
    grad:boolean;
}

export default function Materias( {materias, autoSaving, temaActual, grad}: MateriasProp ) {

    function mostrarMaterias(){
        return materias.map( (materia: ObjMateria) => {
            return <Materia key={materia.id} materia={materia} autoSaving={autoSaving} temaActual={temaActual} grad={grad}/>
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
