import React from 'react'

export default function SignedOut( {googleAuth} ) {

    function signIn(){
        googleAuth();
    }

    return (
        <div>
            <button onClick={signIn}>Ingresar con Google</button>
        </div>
    )
}
