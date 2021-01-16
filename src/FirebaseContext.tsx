import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firebase-firestore'
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const fireBaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DB_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: "G-7DG9TX7RN9"
};

if(!firebase.apps.length){
    firebase.initializeApp(fireBaseConfig);
}



export interface IFirebaseContext{
    firebase: firebase.app.App;
    authProviders: firebase.auth.Auth;
    user: firebase.User | undefined;
    googleProvider: firebase.auth.GoogleAuthProvider;
}

export const FirebaseContext = React.createContext({} as IFirebaseContext)

const FirebaseProvider = ({children}:any)=>{

    let auth = firebase.app().auth();
    const [currentUser] = useAuthState(auth);

    return(
        <FirebaseContext.Provider value={{
                'firebase':firebase.app(),
                authProviders: firebase.app().auth(),
                user: currentUser,
                googleProvider: new firebase.auth.GoogleAuthProvider()
             } as IFirebaseContext}>
            {children}
        </FirebaseContext.Provider>
    );
};

export default FirebaseProvider;
