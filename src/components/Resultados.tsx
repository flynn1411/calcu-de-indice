import React from 'react';
import {useSpring, animated} from 'react-spring';
import { Spring } from 'react-spring/renderprops';
import ObjMateria from '../interfaces/materia';

interface ResultadosProps{
    materias: Array<ObjMateria>;
    tipoIndice: string;
    getTipo: () => string;
    agregarAlGlobal: () => void;
    temaActual: string;
    grad: boolean;
}

export default function Resultados( {materias, tipoIndice, getTipo, agregarAlGlobal, temaActual, grad}: ResultadosProps ) {

    const indiceRedondeado: number = Math.floor(obtenerIndice());
    const indiceNormal: number = obtenerIndice();

    let resultadosDiv = document.getElementById("resultados") as HTMLDivElement;

    if(window.innerWidth <= 600){
        resultadosDiv.scrollIntoView({ block: 'start',  behavior: 'smooth' });
    }else{
        resultadosDiv.scrollIntoView({ block: 'end',  behavior: 'smooth' });
    }

    let failedColor = "rgba(220, 20, 60, 1)";
    let passedColor = "rgba(115, 202, 156, 1)";

    if (temaActual === "synthwave"){
        failedColor = "rgba(255, 41, 117, 1)";
        passedColor = "rgba(109, 241, 216, 1)";
    }

    const animacionEntrada = useSpring({
        from:{
            height: "0",
            borderRadius: "0px"
        },
        to:{
            height: "max-content",
            borderRadius: "5px"
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
        delay: 400
    });

    function obtenerUV(clases: ObjMateria[]): number{
        let uv: number = 0;

        for (let c=0; c<clases.length; c++){uv += clases[c].UV}

        return uv;
    }

    function addToGlobal(){
        agregarAlGlobal();
    }

    function obtenerIndice(): number{

        let materiasSinNSP = materias.filter(materia => materia.Nota !== 0);

        //Indice de Graduación
        if(grad) materiasSinNSP = materiasSinNSP.filter(materia => materia.Nota >= 65);

        let totalUV: number = obtenerUV(materiasSinNSP);
        let suma: number =0;

        for (let i=0; i<materiasSinNSP.length; i++){suma += materiasSinNSP[i].Nota*materiasSinNSP[i].UV}

        return parseFloat((parseFloat(`${(suma/totalUV)}`)).toFixed(2));
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
                        tension: 120,
                        friction: 14
                      }}
                    delay={100}
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
                        tension: 120,
                        friction: 14
                      }}
                    delay={350}
                >

                    {props => <animated.p style={colorIndice} className="datosN">{Math.floor(props.number)}</animated.p>}
                </Spring>
            </animated.div>
            {moverAGlobal()}
        </animated.div>
    )
}
