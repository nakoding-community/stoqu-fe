import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

// Production
let config = {
  apiKey: 'AIzaSyACnwaMPvOQuh9kcGO5GMYs27LEziGQBvE',
  authDomain: 'inamawangi-revamp-prod.firebaseapp.com',
  projectId: 'inamawangi-revamp-prod',
  storageBucket: 'inamawangi-revamp-prod.appspot.com',
  messagingSenderId: '832270865621',
  appId: '1:832270865621:web:c033365c28ce065eecfe5c',
  measurementId: 'G-YTJ9RJRXKP',
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
