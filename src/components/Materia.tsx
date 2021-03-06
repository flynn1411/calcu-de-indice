import React, {useState} from 'react';
import {useSpring, animated} from 'react-spring';
import ObjMateria from '../interfaces/materia';

interface MateriaProp{
    materia: ObjMateria;
    autoSaving: (id: string | null, nuevaMateria: ObjMateria | null, dato?: string) => void;
    temaActual: string;
    grad: boolean;
}

export default function Materia( {materia, autoSaving, temaActual, grad}: MateriaProp ) {
    //Hooks
    const [clase, setClase] = useState<string>(materia.Clase);
    const [nota, setNota] = useState<number>(materia.Nota);
    const [uv] = useState<number>(materia.UV);

    let toBg = "rgba(0, 0, 0, 0)";
    let fromBg = "rgba(38, 67, 81, 1)";


    if(temaActual === "dark"){
        fromBg = "rgba(216, 216, 216, 1)";
    }
    else if(temaActual === "synthwave"){
        fromBg = "rgba(54, 40, 59, 1)";
        
    }

    const newMateria = useSpring({
        from:{
            //color: fromColor,
            background: fromBg
        },
        to:{
            //color: toColor,
            background: toBg
        },
        config:{
            tension: 280,
            friction: 120
          }
        //delay: 750
    });

    function setColor():string{
        if(grad){
            if(materia.Nota >= 65){
                return "materiaInput passed"
            }
            else{
                return "materiaInput"
            }
        }else{
            return "materiaInput"
        }
    }

    function manejarClase(e: React.ChangeEvent<HTMLInputElement>){
        let nuevaClase = e.target.value;
        //console.log(e.target.value)

        if (nuevaClase.match(/^(([ A-Za-z0-9ñÑáéíóúÁÉÍÓÚÜü])|(-))*$/gm) === null){
            nuevaClase = clase;
            e.target.value = clase;
        }

        setClase(nuevaClase)

        autoSaving(`${materia.id}`, {"Clase":nuevaClase, "Nota": nota, "UV": uv}, "Clase");
    }

    function manejarNota(e: React.ChangeEvent<HTMLInputElement>){
        let nuevaNota: any = e.target.value;
        //console.log(e.target.value)

        if(nuevaNota.match(/[0-9]{0,3}$/gm)){
            nuevaNota = parseInt(nuevaNota);
            //console.log(nuevaNota);
    
            if( nuevaNota > 100 ){
                e.target.value = `${100}`;
                nuevaNota = 100;
            }
        }
        else if(nuevaNota === ""){
            nuevaNota = 0;
        }
        
        else{
            e.target.value = `${nota}`;
            nuevaNota = nota;
        }

        setNota(nuevaNota)

        autoSaving(`${materia.id}`, {"Clase":clase, "Nota": nuevaNota, "UV": uv}, "Nota");
    }

    function manejarUV(e: React.ChangeEvent<HTMLInputElement>){
        let nuevoUV: any = e.target.value;
        //console.log(e.target.value)

        if(nuevoUV.match(/^(0|1|2)?[0-9]{1}$/gm)){
            nuevoUV = parseInt(nuevoUV);
            
        }
        else if(nuevoUV === ""){
            nuevoUV = 0;
        }

        else{
            e.target.value = `${uv}`;
            nuevoUV = uv;
        }

        //setUV(nuevoUV)

        autoSaving(`${materia.id}`, {"Clase":clase, "Nota": nota, "UV": nuevoUV}, "UV");
    }

    function claseInput(){
        if(!clase.match(/^Clase([0-9]{1,3})$/)){
            return <input className={`claseInput ${setColor()}`} type='text' placeholder='Clase' defaultValue={clase} onChange={manejarClase}/>
        }else{
            return <input className={`claseInput ${setColor()}`} type='text' placeholder={clase} defaultValue={""} onChange={manejarClase}/>
        }
    }

    return (
        <tr>
            <td><animated.div style={newMateria}>{ claseInput() }</animated.div></td>
            <td><animated.div style={newMateria}><input className={setColor()} type='number' min="0" max="100" defaultValue={nota === 0 ? "": nota} onChange={manejarNota}/></animated.div></td>
            <td><animated.div style={newMateria}><input className={setColor()} type='number' min="0" max="20" defaultValue={uv === 0 ? "": uv} onChange={manejarUV}/></animated.div></td>
        </tr>
    )
}
