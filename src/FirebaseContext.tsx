import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firebase-firestore'
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const fireBaseConfig = {
    apiKey: "AIzaSyCrFbPHJizkQbb3IEPf_DyNjwcwZCD7NpM",
    authDomain: "calculadoradeindice.firebaseapp.com",
    databaseURL: "https://calculadoradeindice.firebaseio.com",
    projectId: "calculadoradeindice",
    storageBucket: "calculadoradeindice.appspot.com",
    messagingSenderId: "180634225139",
    appId: "1:180634225139:web:c4300eb226ca6f4db46a86",
    measurementId: "G-7DG9TX7RN9"
};

if(!firebase.apps.length){
    firebase.initializeApp(fireBaseConfig);
}



export interface IFirebaseContext{
    firebase: firebase.app.App;
    authProviders: firebase.auth.Auth;
    user: firebase.User | null;
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
