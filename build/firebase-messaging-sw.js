// Scripts for firebase and firebase messaging
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyCZrt6XSYjH1ncDCQSo1n6Rz4DgiNk__tw",
  authDomain: "inamawangi-d1766.firebaseapp.com",
  projectId: "inamawangi-d1766",
  storageBucket: "inamawangi-d1766.appspot.com",
  messagingSenderId: "512541535572",
  appId: "1:512541535572:web:936057206e1b0b7202ecc1",
  measurementId: "G-SFXTFEVE73",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
