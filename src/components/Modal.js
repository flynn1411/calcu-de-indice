import React from 'react';
import { useSpring, animated } from 'react-spring';

export default function Modal( {viewModal, closeModal} ) {

    const modalAnimation = useSpring({
        from:{
            opacity:0/*,
            left: "2vw",
            bottom: "2vh",
            height: "3%",
            width: "3%"*/
        },
        to:{
            opacity:1
        }
    });

    function mostrar(){
        if(!viewModal){
            return null
        }else{
            return (
                <div id="modal-bg">
                    <animated.div style={modalAnimation} id="modal-content">
                        sdagdfgsesfvdsdfgsefdesdfes
                        Hola Mundo
                        
                        <button onClick={e => {closeModal(e)}}>
                            Cerrar
                        </button>
                    </animated.div>                
                </div>
            )
        }
    }

    return (
        <>
          {mostrar()}  
        </>
    )
}
