import React, {useState} from 'react';

export default function Materia( {materia, autoSaving} ) {
    //Hooks
    const [clase, setClase] = useState(materia.Clase);
    const [nota, setNota] = useState(materia.Nota);
    const [uv] = useState(materia.UV);

    function manejarClase(e){
        let nuevaClase = e.target.value;
        //console.log(e.target.value)

        if (nuevaClase.match(/^(([ A-Za-z0-9áéíóúÁÉÍÓÚÜü])|(-))*$/gm) === null){
            nuevaClase = clase;
            e.target.value = clase;
        }

        setClase(nuevaClase)

        autoSaving(materia.id, {"Clase":nuevaClase, "Nota": nota, "UV": uv});
    }

    function manejarNota(e){
        let nuevaNota = e.target.value;
        //console.log(e.target.value)

        if(nuevaNota.match(/[0-9]{0,3}$/gm)){
            nuevaNota = parseInt(nuevaNota);
            //console.log(nuevaNota);
    
            if( nuevaNota > 100 ){
                e.target.value = 100;
                nuevaNota = 100;
            }
        }
        else if(nuevaNota === ""){
            nuevaNota = 0;
        }
        
        else{
            e.target.value = nota;
            nuevaNota = nota;
        }

        setNota(nuevaNota)

        autoSaving(materia.id, {"Clase":clase, "Nota": nuevaNota, "UV": uv});
    }

    function manejarUV(e){
        let nuevoUV = e.target.value;
        //console.log(e.target.value)

        if(nuevoUV.match(/^(0|1|2)?[0-9]{1}$/gm)){
            nuevoUV = parseInt(nuevoUV);
            
        }
        else if(nuevoUV === ""){
            nuevoUV = 0;
        }

        else{
            e.target.value = uv;
            nuevoUV = uv;
        }

        setNota(nuevoUV)

        autoSaving(materia.id, {"Clase":clase, "Nota": nota, "UV": nuevoUV});
    }

    function claseInput(){
        if(!clase.match(/^Clase([0-9]{1,3})$/)){
            return <input className='claseInput' type='text' placeholder='Clase' defaultValue={clase} onChange={manejarClase}/>
        }else{
            return <input className='claseInput' type='text' placeholder={clase} defaultValue={""} onChange={manejarClase}/>
        }
    }

    return (
        <tr>
            <td><div>{ claseInput() }</div></td>
            <td><div><input type='number' min="0" max="100" defaultValue={nota === 0 ? "": nota} onChange={manejarNota}/></div></td>
            <td><div><input type='number' min="0" max="20" defaultValue={uv === 0 ? "": uv} onChange={manejarUV}/></div></td>
        </tr>
    )
}
