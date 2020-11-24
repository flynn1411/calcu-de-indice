import React from 'react'

export default function Modal( {viewModal, closeModal} ) {

    function mostrar(){
        if(!viewModal){
            return null
        }else{
            return (
                <div id="modal-bg">
                <div id="modal-content">
                    sdagdfgsesfvdsdfgsefdesdfes
                    Hola Mundo
                    
                    <button onClick={e => {closeModal(e)}}>
                        Cerrar
                    </button>
                </div>
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
