import React from 'react';
import { useSpring, animated } from 'react-spring';
import ModalMessage from '../interfaces/message';

interface ModalProps{
    closeModal: ()=>void;
    temaActual: string;
    message: ModalMessage | null
}

export default function Modal( {closeModal, temaActual, message}: ModalProps ) {

    const modalBgAnimation = useSpring({
        from:{
            background: "rgba(0, 0, 0, 0)"
        },
        to:{
            background: "rgba(0, 0, 0, 0.69)"
        },
        height: `${window.innerHeight}px`
    });

    const modalEntranceDesktop = useSpring({
        from:{
            height: "9vh",
            width: "4vw",
            top: "89.4vh",
            left: "5.2vw",
            borderRadius: "50%"
        },
        to:{
            height: "80vh",
            width: "90vw",
            top: "10vh",
            left: "5vw",
            borderRadius: "0%"
        },
        delay: 250,
        height:`${window.innerHeight*0.80}px`
    });

    const modalEntranceMobile = useSpring({
        from:{
            opacity: 0
        },
        to: {
            opacity: 1
        },
        delay: 500,
        height:`${window.innerHeight*0.80}px`
    });

    function getMessage(){
        if(message){
            return(
                <>
                    <div id="header">
                        {message.header}
                    </div>
                    <div  id="socialMedia">
                        {message.content}
                    </div>
                </>
            )
        }else{
            return(
                <>
                    <div id="header">
                        <h2>2021</h2>
                        <h2><a href="https://flynn1411.github.io" target="_blank" rel="noreferrer">Josué Ariel Izaguirre</a></h2>
                        <h2><a href="https://github.com/flynn1411/flynn1411.github.io/releases/tag/v1.4.6" target="_blank" rel="noreferrer">v1.4.6</a></h2>
                    </div>
                    <div  id="socialMedia">
                        <div className="list-item">
                            <img src={`resources/${temaActual}/github-logo.png`} alt="github"/>
                            <a href="https://github.com/flynn1411" target="_blank" rel="noreferrer">flynn1411</a>
                        </div>
                        <div className="list-item">
                            <img src={`resources/${temaActual}/twitter.png`} alt="twitter"/>
                            <a href="https://twitter.com/Flynn1411" target="_blank" rel="noreferrer">@flynn1411</a>
                        </div>
                        <div className="list-item">
                            <img src={`resources/${temaActual}/email.png`} alt="email"/>
                            <a href="mailto:flynn1411@gmail.com" target="_blank" rel="noreferrer">flynn1411@gmail.com</a>
                        </div>
                        <div id="utilities">
                            <h2 style={{textAlign: "center", textDecoration: "underline"}}>Utilidades</h2>
                            <ul>
                                <li>Calcular el índice global o de periodo (con guardado automático de datos), las notas que no sean llenadas o sean 0 no serán tomadas para calcular el indice:
                                    <br/>
                                    <br/>
                                    <video
                                        src="resources/manual/calcular.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className={"manualVidDesktop"}
                                    ></video>
                                    <br/>
                                    <br/>
                                </li>
                                <li>
                                    Habilidad para instalar la página web como aplicación nativa (tambien disponible en el navegador web Safari de iPhones). Para lograr eso, debes de apretar este mensaje la primera vez que te cargue la app.
                                    <br/><br/>
                                    <img src="resources/manual/pwa.jpg" alt="Optimización Aplicación Web Progresiva" className={"manualVidDesktop"}/>
                                </li>
                                <li>
                                    En la sección para calcular el índice global, se encuentra una opción para obtener el índice unicamente con las clases aprobadas (mayor o igual a 65 en su nota final).
                                    <br/>
                                    <br/>
                                    <video
                                        src="resources/manual/calcular-sin-rpb.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className={"manualVidDesktop"}
                                    ></video>
                                <br/>
                                <br/>
                                </li>
                                <li>
                                    En la sección para calcular el índice de periodo, se puede encontrar un botón abajo de la sección en donde se muestran los resultados para agregar las clases del periodo actual a las clases en la sección del índice global. Esto con la intención de evitar volver a escribir los datos de una sección a la siguiente.
                                    <video
                                        src="resources/manual/mover-a-global.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className={"manualVidDesktop"}
                                    ></video>
                                    <br/>
                                    <br/>
                                </li>
                                <li>
                                    !Tiene temas¡ Así es, en ambas secciones (global o periodo) se encuentra un botón el cual cambia el tema actual de la página. En estos momentos solamente se encuentran tres temas (claro, oscuro y uno synthwave o de colores neon ochenteros), pero podría agregar más con el tiempo.
                                    <video
                                        src="resources/manual/cambio-temas.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className={"manualVidDesktop"}
                                    ></video>
                                    <br/>
                                    <br/>
                                </li>
                                <li>
                                    Si deseas tener una visualización gráfica de tu índice global puedes hacerlo.
                                    <video
                                        src="resources/manual/modo-grafica.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className={"manualVidDesktop"}
                                    ></video>
                                    <br/>
                                    <br/>
                                </li>
                                <li>
                                    Otra gran utilidad es poder guardar tus datos al ingresar con una cuenta de google, o al ingresar con la misma, tus datos existentes serán cargados, incluyendo el último tema que seleccionaste. Los datos se guardan en <a href="https://firebase.google.com/" style={{textDecoration: "underline"}}>Firebase</a> de manera segura utilizando <a href="https://programacionymas.com/blog/protocolo-oauth-2" style={{textDecoration: "underline"}}>OAuth 2</a> al ingresar con una cuenta de Google.
                                    <video
                                        src="resources/manual/google-signin.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className={"manualVidDesktop"}
                                    ></video>
                                    <br/>
                                    <br/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            )
        }
    }

    function mostrar(){
        return (
            <animated.div style={modalBgAnimation} id="modal-bg">
                <animated.div style={ window.innerWidth > 600 ? modalEntranceDesktop : modalEntranceMobile } id="modal-content">
                    {getMessage()}
                    <div id={"buttonContainer"}>
                        <button onClick={() => {closeModal()}}>
                            Cerrar
                        </button>
                    </div>
                </animated.div>                
            </animated.div>
        )
    }

    return (
        <>
          {mostrar()}  
        </>
    )
}
