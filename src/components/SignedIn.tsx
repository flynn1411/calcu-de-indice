import React, {useContext} from 'react';
import { useSpring, animated } from 'react-spring';
import {FirebaseContext} from '../FirebaseContext';

interface SignedInProps{
    cerrarSesion: () => void;
}

export default function SignedIn( {cerrarSesion}: SignedInProps ) {
    const usuario = useContext(FirebaseContext).user;

    const animacionSignedIn = useSpring({
        from: {
            opacity: 0,
            marginBottom: -100,
            marginTop: 100,
            borderRadius: "0px"
        },
        to: {
            opacity: 1,
            marginBottom: 0,
            marginTop: 0,
            borderRadius: "5px"
        },
        config:{
            tension: 117,
            friction: 12,
            velocity: -5
        }
    });

    const animacionFoto = useSpring({
        from:{
            borderRadius: "0%"
        },
        to:{
            borderRadius: "50%"
        },
        config:{
            tension: 120,
            friction: 14
          },
          delay: 500
    });

    return (
        <animated.div style={animacionSignedIn} id="perfilGoogle">
            {() => {
                if(usuario){
                    return (<div id="profilepic"><animated.img style={animacionFoto} id="fotoPerfil" src={`${usuario.photoURL}`} alt={"Foto de perfil"}/></div>);
                }
            }}
            Usuario Actual:<br></br>
            <div id="nombrePerfil">{() => {if (usuario !== undefined) return `${usuario.displayName}`}}</div>
            <br></br>
            <div id="signedIn-buttons">
                <button className="hvr-ripple-out" id="sign-out" onClick={cerrarSesion}>Cerrar Sesión</button>
                <br></br>
                <br></br>
                <button className="hvr-ripple-out" id="delete">Eliminar Usuario</button>
            </div>
        </animated.div>
    )
}
