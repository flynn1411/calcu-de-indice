import React from 'react';
import {useSpring, animated} from 'react-spring';
import { Spring } from 'react-spring/renderprops';

export default function Resultados( {materias, tipoIndice, getTipo, agregarAlGlobal} ) {

    const indiceRedondeado = parseFloat(obtenerIndice()).toFixed(0);

    const animacionEntrada = useSpring({
        from:{
            height: "1vh"
        },
        to:{
            height:"48vh"
        },
        config:{
            tension: 280,
            friction: 109
          }
    });

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
            return (<div>
                <button onClick={addToGlobal}>
                    Agregar Clases al Índice Global
                </button>
            </div>)
        }
    }

    return (
        <animated.div id="accionCalcular" style={animacionEntrada}>
            <div className="results">
                <p className="datosT">Indice {getTipo()}</p>
                <p className="datosN">{obtenerIndice()}</p>
            </div>
        
            <div className="results">
                <p className="datosT">Redondeado</p>
                <Spring
                    from={{ number: 0 }}
                    to={{ number: indiceRedondeado }}
                    config={{
                        tension: 280,
                        friction: 109
                      }}
                >

                    {props => <p className="datosN">{Math.floor(props.number)}</p>}
                </Spring>
            </div>
            {moverAGlobal()}
        </animated.div>
    )
}
