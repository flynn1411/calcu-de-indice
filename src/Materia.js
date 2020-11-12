import React, {useState, useRef} from 'react'

export default function Materia( {materia, manejarCambiosMateria} ) {
    //Hooks
    const [clase, setClase] = useState(materia.Clase);
    const [nota, setNota] = useState(materia.Nota);
    const [uv, setUV] = useState(materia.UV);

    //Referencias
    const refClase = useRef();
    const refNota = useRef();
    const refUV = useRef();

    function manejarClase(e){
        let nuevaClase = refClase.current.value;
        //console.log(materia.id);

        manejarCambiosMateria(materia.id, {"Clase":nuevaClase, "Nota": nota, "UV": uv});
    }

    /*function filtrarDatos(e){

    }*/

    function claseInput(){
        if(!clase.match(/^Clase([0-9]{1,3})$/)){
            return <input ref={refClase} type='text' placeholder='Clase' defaultValue={clase} onChange={manejarClase}/>
        }else{
            return <input ref={refClase} type='text' placeholder={clase} defaultValue={""} onChange={manejarClase}/>
        }
    }

    return (
        <tr>
            <td>{ claseInput() }</td>
            <td><input type='number' min="0" max="100" defaultValue={nota} /></td>
            <td><input type='number' min="0" max="20" defaultValue={uv} /></td>
        </tr>
    )
}
