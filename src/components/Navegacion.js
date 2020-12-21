import React from 'react';

export default function Navegacion( {cambiarModalidad, tipoIndice, temaActual, setViewModal} ) {

    function cambiarActive(id){
        cambiarModalidad(id);

        if(id !== null){
            //document.getElementById("modoActual").innerHTML = getModalidadActual();
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
        }

    }

    function setActive(id){
        if(id === tipoIndice){
            return "hvr-grow dNavItems seleccion active"
        }else{
            return "hvr-grow dNavItems seleccion"
        }
    }

    function getModalidadActual(){
        if(tipoIndice === "GLOBAL"){
            return "Global";
        }else{
            return "Periodo";
        }
    }

    function showModal(){
        console.log("corrió");
        setViewModal(true);
    }

    return (
        <>
        <div id="navbar-desktop" className="navegacion">
            <div className="dNavItems seleccion" id="logo" onClick={e => {showModal();}}>
                <img className="hvr-grow" src={`resources/${temaActual}/info.png` } alt="Icono de Información."/>
            </div>
            <div className="dNavItems" id="indice">Indice:</div>
            <div className={setActive("GLOBAL")} id="global" onClick={() => {cambiarActive("GLOBAL")}}>Global</div>
            <div className={setActive("PERIODO")} id="periodo" onClick={() => {cambiarActive("PERIODO")}}>Periodo</div>
        </div>
        <div id="navbar-mobile" className="navegacion">
            <div className="dNavItems seleccion" id="logo" onClick={e => {showModal();}}>
                    <img className="hvr-grow" src={`resources/${temaActual}/info.png` } alt="Info"/>
                </div>
                <div className="dNavItems" id="indice">Indice:</div>
                <div className={"hvr-grow dNavItems seleccion active"} id="modoActual" onClick={() => {cambiarActive(null)}}>
                    {getModalidadActual()}
                </div>
        </div>
        </>
    )
}
