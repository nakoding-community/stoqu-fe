import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

// Production
let config = {
  apiKey: 'AIzaSyB9CmFxaPSMvOXGzYmlzj_bHktilpKwq5k',
  authDomain: 'inamawangi-revamp-dev.firebaseapp.com',
  projectId: 'inamawangi-revamp-dev',
  storageBucket: 'inamawangi-revamp-dev.appspot.com',
  messagingSenderId: '288480234486',
  appId: '1:288480234486:web:16e7dfcb5f7b5769eb15d7',
  measurementId: 'G-Y9RW7QMRNZ',
};

// Development
if (process.env.REACT_APP_ENV !== 'prod') {
  config = {
    apiKey: 'AIzaSyB9CmFxaPSMvOXGzYmlzj_bHktilpKwq5k',
    authDomain: 'inamawangi-revamp-dev.firebaseapp.com',
    projectId: 'inamawangi-revamp-dev',
    storageBucket: 'inamawangi-revamp-dev.appspot.com',
    messagingSenderId: '288480234486',
    appId: '1:288480234486:web:16e7dfcb5f7b5769eb15d7',
    measurementId: 'G-Y9RW7QMRNZ',
  };
}

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const firebaseApp = firebase.app();
