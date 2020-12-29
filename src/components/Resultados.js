import React from 'react';
//import {useSpring, animated} from 'react-spring';

export default function Resultados( {materias, tipoIndice, getTipo, agregarAlGlobal} ) {

    function obtenerUV(clases){
        let uv = 0;

        for (let c=0; c<clases.length; c++){uv += clases[c].UV}

        return uv;
    }

    function addToGlobal(e){
        agregarAlGlobal();
    }

    function obtenerIndice(){

        let materiasSinNSP = materias.filter(materia => materia.Nota !== 0);

        let totalUV = obtenerUV(materiasSinNSP);
        let suma=0;

        for (let i=0; i<materiasSinNSP.length; i++){suma += materiasSinNSP[i].Nota*materiasSinNSP[i].UV}

        return (parseFloat((suma/totalUV))).toFixed(2);
    }

    function moverAGlobal(){
        if(tipoIndice === "PERIODO"){
            return (<tr>
            <td>
                <button onClick={addToGlobal}>
                    Agregar Clases al Índice Global
                </button>
            </td>
        </tr>)
        }
    }

    return (
        <table>
            <tbody>
                <tr>
                    <td>
                        <p>Indice {getTipo()}</p>
                        <p>{obtenerIndice()}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Redondeado</p>
                        <p>{parseFloat(obtenerIndice()).toFixed(0)}</p>
                    </td>
                </tr>
                {moverAGlobal()}
            </tbody>
        </table>
    )
}
