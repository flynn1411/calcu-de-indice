import React from 'react';
import {useSpring, animated} from 'react-spring';
import { Spring } from 'react-spring/renderprops';

export default function Resultados( {materias, tipoIndice, getTipo, agregarAlGlobal, temaActual} ) {

    const indiceRedondeado = parseFloat(obtenerIndice()).toFixed(0);
    const indiceNormal = obtenerIndice();

    let failedColor = "rgba(220, 20, 60, 1)";
    let passedColor = "rgba(115, 202, 156, 1)";

    if (temaActual === "synthwave"){
        failedColor = "rgba(255, 41, 117, 1)";
        passedColor = "rgba(109, 241, 216, 1)";
    }

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

    const colorIndice = useSpring({
        from:{
            color: failedColor
        },
        to:{
            color: indiceRedondeado < 65 ? failedColor: passedColor
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

        if(window.innerWidth <= 600){
            document.getElementById("resultados").scrollIntoView({ block: 'start',  behavior: 'smooth' });
        }else{
            document.getElementById("resultados").scrollIntoView({ block: 'end',  behavior: 'smooth' });
        }

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
                <Spring
                    from={{ number: 0
                     }}
                    to={{ number: indiceNormal
                     }}
                    config={{
                        tension: 280,
                        friction: 109
                      }}
                      delay={500}
                >

                    {props => <animated.p style={colorIndice} className="datosN">{(props.number).toFixed(2)}</animated.p>}
                </Spring>
            </div>
        
            <div className="results">
                <p className="datosT">Redondeado</p>
                <Spring
                    from={{ number: 0
                     }}
                    to={{ number: indiceRedondeado
                     }}
                    config={{
                        tension: 280,
                        friction: 109
                      }}
                      delay={1000}
                >

                    {props => <animated.p style={colorIndice} className="datosN">{Math.floor(props.number)}</animated.p>}
                </Spring>
            </div>
            {moverAGlobal()}
        </animated.div>
    )
}
