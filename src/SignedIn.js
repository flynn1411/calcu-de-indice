import React from 'react'

export default function SignedIn( {cerrarSesion, usuario} ) {
    return (
        <div>
            <div><img id="fotoPerfil" src={usuario.photoURL} alt={"Foto de perfil"}/></div>
            <button onClick={cerrarSesion}>Cerrar Sesión</button>
        </div>
    )
}
