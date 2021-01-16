import React from 'react'

interface SignedOutProps{
    googleAuth: ()=>void;
}

export default function SignedOut( {googleAuth}:SignedOutProps ) {

    function signIn(){
        googleAuth();
    }

    return (
        <div>
            <button className="hvr-ripple-out" onClick={signIn}>Ingresar con Google</button>
        </div>
    )
}
