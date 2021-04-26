import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import ObjMateria from '../interfaces/materia';
import GraphMode from './GraphMode';
import Tabla from './Tabla';

interface contenidoProps{
    materias: Array<ObjMateria>;
    setMaterias: (newMaterias: Array<ObjMateria>) => void;
    crearID: () => string;
    tipoIndice: string;
    getTipo: ()=>string;
    ultimosCambios: string;
    setUltimosCambios: (cambios: string) => void;
    cantidadMaxima: number;
    guardarEnStorage: (nuevasMaterias: ObjMateria[]) => void;
    autoSaving: (id: string | null, nuevaMateria: ObjMateria | null, dato?: string) => void;
    agregarGlobal: () => void;
    temaActual: string;
    setTemaActual: (nuevoTema: string) => void;
    modalidad: string;
    saving: boolean;
    refCambios: React.MutableRefObject<HTMLParagraphElement | null>;
    graphMode: boolean;
    setGraphMode: (mode: boolean) => void;
};

interface infoVentana{
    "height": number
};

export default function Contenido( {
    materias,
    setMaterias,
    crearID,
    tipoIndice,
    getTipo,
    ultimosCambios,
    setUltimosCambios,
    cantidadMaxima,
    guardarEnStorage,
    autoSaving,
    //refCambios,
    agregarGlobal,
    temaActual,
    setTemaActual,
    //mostrarResultados,
    modalidad,
    saving,
    refCambios,
    graphMode,
    setGraphMode
}: contenidoProps ) {

    const [indiceActual, setIndiceActual] = useState<number>(-1);
    const [currentHeight, setCurrentHeight] = useState<infoVentana>({
        "height": 800
    });

    useEffect(()=>{
        setCurrentHeight({"height":window.innerHeight});
    },[]);

    const periodoSpawn = {
        "width": "34vw",
        "height": "1vh",
        "bottom": "9vh",
        "position": "absolute",
        "right": "2vw"
    };

    const globalSpawn = {
        "width": "34vw",
        "height": "1vh",
        "bottom": "9vh",
        "position": "absolute",
        "right": "35vw"
    };

    let spawnActual = tipoIndice === "GLOBAL" ? globalSpawn:periodoSpawn;

    const animacionDesktop = useSpring({
        from:{
            width: spawnActual.width,
            height: spawnActual.height,
            opacity: 0.2,
            right: spawnActual.right,
            bottom: spawnActual.bottom,
            borderRadius: "50%"
        },
        to:{
            width: "95vw",
            height: "85vh",
            opacity: 1,
            right: "2.5vw",
            bottom: "13.5vh",
            borderRadius: "0%"
        },
        config: {
            mass: 2,
            tension: 207,
            friction: 40,
            clamp: true,
            velocity: 2
        }
    });

    const animacionMobile = useSpring({
        from:{
            height: `${currentHeight.height*0.01}px`,
            opacity: 0,
            top: "86vh"/*,
            right: "1vw",
            width: "37vw"*/
        },
        to:{
            height: `${currentHeight.height*0.84}px`,
            opacity: 1,
            top: "1.5vh"/*,
            width: "95vw",
            right: "2.5vw"*/
        },
        config:{
            velocity: 19
          }
    });
    
    function enterGraphMode(){
        if(tipoIndice === "GLOBAL" && graphMode){
            return (
                <GraphMode materias={materias} indiceActual={indiceActual}/>
            );
        }else{
            return(
                <Tabla
                materias={materias}
                setMaterias={setMaterias}
                crearID = {crearID}
                tipoIndice= {tipoIndice}
                getTipo= {getTipo}
                ultimosCambios= {ultimosCambios}
                setUltimosCambios= {setUltimosCambios}
                cantidadMaxima= {cantidadMaxima}
                guardarEnStorage= {guardarEnStorage}
                autoSaving= {autoSaving}
                //refCambios= {}
                agregarGlobal= {agregarGlobal}
                temaActual= {temaActual}
                setTemaActual= {setTemaActual}
                //mostrarResultados= {}
                modalidad= {modalidad}
                saving= {saving}
                refCambios ={refCambios}
                setIndiceActual={setIndiceActual}
            />
            );
        }
    }

    function addToggleSwitch(){
        if(tipoIndice==="GLOBAL"){
            return(
                <div id="graphToggleContainer">
                    <input
                        type="checkbox"
                        name="graphToggle"
                        id="graphToggle"
                        checked={graphMode}
                        onChange={()=>{setGraphMode(!graphMode)}}
                    />
                    <label htmlFor="graphToggle" className="graphLabel">
                        <i className="fas fa-table"></i>
                        <i className="fas fa-chart-line"></i>
                    </label>
                </div>
            )
        }
    }

    return (
        <animated.div style={ window.innerWidth > 600 ? animacionDesktop : animacionMobile} id="pagina">
            <div id="titulo">
                <div id="tituloInner">
                    <h1>
                        <strong>Índice {getTipo()}</strong>
                    </h1>
                    {addToggleSwitch()}
                </div>
            </div>
            {enterGraphMode()}
        </animated.div>
    )
}
