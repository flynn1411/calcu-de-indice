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
        }
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
        delay: 250
    });

    const modalEntranceMobile = useSpring({
        from:{opacity: 0},
        to: {opacity: 1},
        delay: 500
    });

    function getMessage(){
        if(message){
            return(
                <>
                    <animated.div style={modalEntranceMobile} id="header">
                        {message.header}
                    </animated.div>
                    <animated.div  style={modalEntranceMobile} id="socialMedia">
                        {message.content}
                    </animated.div>
                </>
            )
        }else{
            return(
                <>
                    <animated.div style={modalEntranceMobile} id="header">
                        <h2>2021</h2>
                        <h2><a href="https://flynn1411.github.io" target="_blank" rel="noreferrer">Josué Ariel Izaguirre</a></h2>
                        <h2><a href="https://github.com/flynn1411/flynn1411.github.io/releases/tag/v1.4.6" target="_blank" rel="noreferrer">v1.4.6</a></h2>
                    </animated.div>
                    <animated.div  style={modalEntranceMobile} id="socialMedia">
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
                    </animated.div>
                </>
            )
        }
    }

    function mostrar(){
        return (
            <animated.div style={modalBgAnimation} id="modal-bg">
                <animated.div style={ window.innerWidth > 600 ? modalEntranceDesktop : modalEntranceMobile } id="modal-content">
                    {getMessage()}
                    <button onClick={() => {closeModal()}}>
                        Cerrar
                    </button>
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
