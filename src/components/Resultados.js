import React from 'react';
import {useSpring, animated} from 'react-spring';
import { Spring } from 'react-spring/renderprops';

export default function Resultados( {materias, tipoIndice, getTipo, agregarAlGlobal, temaActual} ) {

    const indiceRedondeado = parseFloat(obtenerIndice()).toFixed(0);
    const indiceNormal = obtenerIndice();

    //document.getElementById("resultados").style.height = window.innerWidth <= 600 ? "35vh" : "48vh";

    if(window.innerWidth <= 600){
        document.getElementById("resultados").scrollIntoView({ block: 'start',  behavior: 'smooth' });
    }else{
        document.getElementById("resultados").scrollIntoView({ block: 'end',  behavior: 'smooth' });
    }

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
            height: "max-content"
        }
    });

    const entradaResultados = useSpring({
        from:{
            opacity:0,
            height: "0%"
        },
        to:{
            opacity: 1,
            height: "max-content"
        },
        config:{
            friction: 71
          }
    })

    const colorIndice = useSpring({
        from:{
            color: failedColor
        },
        to:{
            color: indiceRedondeado < 65 ? failedColor: passedColor
        },
        delay: 2000
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
        <animated.div id="resultados2" style={animacionEntrada}>
            <animated.div style={entradaResultados} className="results">
                <p className="datosT">Indice {getTipo()}</p>
                <Spring
                    from={{ number: 0
                     }}
                    to={{ number: indiceNormal
                     }}
                    config={{
                        tension: 109,
                        friction: 113
                      }}
                      delay={500}
                >

                    {props => <animated.p style={colorIndice} className="datosN">{(props.number).toFixed(2)}</animated.p>}
                </Spring>
            </animated.div>
        
            <animated.div style={entradaResultados} className="results">
                <p className="datosT">Redondeado</p>
                <Spring
                    from={{ number: 0
                     }}
                    to={{ number: indiceRedondeado
                     }}
                    config={{
                        tension: 109,
                        friction: 113
                      }}
                      delay={750}
                >

                    {props => <animated.p style={colorIndice} className="datosN">{Math.floor(props.number)}</animated.p>}
                </Spring>
            </animated.div>
            {moverAGlobal()}
        </animated.div>
    )
}
