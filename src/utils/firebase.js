import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

// Production
let config = {
  apiKey: 'AIzaSyC4E9iVVm-10JjUrvMSEGRVtLHkwQTIon8',
  authDomain: 'inamawangi-59d3e.firebaseapp.com',
  projectId: 'inamawangi-59d3e',
  storageBucket: 'inamawangi-59d3e.appspot.com',
  messagingSenderId: '282036610633',
  appId: '1:282036610633:web:9753a4fe48938f89080198',
  measurementId: 'G-FRLWBBZBB4',
};

// Development
if (process.env.REACT_APP_ENV !== 'prod') {
  config = {
    apiKey: 'AIzaSyCZrt6XSYjH1ncDCQSo1n6Rz4DgiNk__tw',
    authDomain: 'inamawangi-d1766.firebaseapp.com',
    projectId: 'inamawangi-d1766',
    storageBucket: 'inamawangi-d1766.appspot.com',
    messagingSenderId: '512541535572',
    appId: '1:512541535572:web:936057206e1b0b7202ecc1',
    measurementId: 'G-SFXTFEVE73',
  };
}

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const firebaseApp = firebase.app();
