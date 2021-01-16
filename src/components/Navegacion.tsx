import React from 'react';

interface NavegacionProps{
    cambiarModalidad: (dato: string | null)=>void;
    tipoIndice: string;
    temaActual: string;
    setViewModal: (viewModal: boolean)=>void;
}

export default function Navegacion( {cambiarModalidad, tipoIndice, temaActual, setViewModal}:NavegacionProps ) {

    function cambiarActive(id: string | null){
        cambiarModalidad(id);

        if(id !== null){
            //document.getElementById("modoActual").innerHTML = getModalidadActual();
            let elementoActivo;
            let elementoViejo;
    
            if(id==="GLOBAL"){
                elementoActivo = document.getElementById("global") as HTMLDivElement;
                elementoViejo = document.getElementById("periodo") as HTMLDivElement;
            }else{
                elementoActivo = document.getElementById("periodo") as HTMLDivElement;
                elementoViejo = document.getElementById("global") as HTMLDivElement;
            }
    
            elementoViejo.className = "hvr-grow dNavItems seleccion";
            elementoActivo.className = "hvr-grow dNavItems seleccion active";
        }

    }

    function setActive(id: string){
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
        setViewModal(true);
    }

    return (
        <>
        <div id="navbar-desktop" className="navegacion">
            <div className="dNavItems seleccion" id="logo" onClick={e => {showModal();}}>
                <img className="hvr-grow" src={`resources/${temaActual}/info.png`} alt="Icono de Información."/>
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
