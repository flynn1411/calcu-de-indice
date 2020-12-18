import React from 'react';
import { useSpring, animated } from 'react-spring';

export default function SignedIn( {cerrarSesion, usuario} ) {
    //checkAuthedUser();

    const animacionSignedIn = useSpring({
        from: {
            opacity: 0,
            marginBottom: -100,
            marginTop: 100
        },
        to: {
            opacity: 1,
            marginBottom: 0,
            marginTop: 0
        },
        config:{
            tension: 117,
            friction: 12,
            velocity: -5
        }
    });

    return (
        <animated.div style={animacionSignedIn}>
            <div><img id="fotoPerfil" src={usuario.photoURL} alt={"Foto de perfil"}/></div>
            Usuario Actual:<br></br>
            <div id="nombrePerfil">{usuario.displayName}</div>
            <br></br>
            <div id="signedIn-buttons">
                <button id="sign-out" onClick={cerrarSesion}>Cerrar Sesión</button>
                <br></br>
                <br></br>
                <button id="delete">Eliminar Usuario</button>
            </div>
        </animated.div>
    )
}
