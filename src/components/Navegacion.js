import React from 'react'

export default function Navegacion( {cambiarModalidad, tipoIndice} ) {

    function cambiarActive(id){
        let elementoActivo = null;
        let elementoViejo = null;

        if(id==="GLOBAL"){
            elementoActivo = document.getElementById("global");
            elementoViejo = document.getElementById("periodo");
        }else{
            elementoActivo = document.getElementById("periodo");
            elementoViejo = document.getElementById("global");
        }

        elementoViejo.className = "dNavItems seleccion";
        elementoActivo.className = "dNavItems seleccion active";

        cambiarModalidad(id);
    }

    function setActive(id){
        if(id === tipoIndice){
            return "dNavItems seleccion active"
        }else{
            return "dNavItems seleccion"
        }
    }

    return (
        <>
        <div id="navbar-desktop" className="navegacion">
            <div className="dNavItems" id="logo">info</div>
            <div className="dNavItems" id="indice">Indice:</div>
            <div className={setActive("GLOBAL")} id="global" onClick={() => {cambiarActive("GLOBAL")}}>Global</div>
            <div className={setActive("PERIODO")} id="periodo" onClick={() => {cambiarActive("PERIODO")}}>Periodo</div>
        </div>
        <div id="navbar-mobile" className="navegacion">

        </div>
        </>
    )
}
