import React from 'react';
import Materia from './Materia';
import { useSpring, animated } from 'react-spring';
//import uuidv4 from 'uuid/dist/v4'

export default function Materias( {materias, autoSaving} ) {

    const animacionTabla = useSpring({
        from:{
            opacity: 0,
            marginTop: "50vh"
        },
        to:{
            opacity: 1,
            marginTop: "0vh"
        }
    });

    function mostrarMaterias(){
        return materias.map( materia => {
            return <Materia key={materia.id} materia={materia} autoSaving={autoSaving}/>
        } )
    }

    return (
        <animated.table style={animacionTabla} id="datos">
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
        </animated.table>
    )
}
