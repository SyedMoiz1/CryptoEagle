

  const firebaseConfig = {
    apiKey: "AIzaSyCNjrhqFXZR5MoBWB8_kOJL503IMVbSMR8",
    authDomain: "cryptoeagle-3146b.firebaseapp.com",
    projectId: "cryptoeagle-3146b",
    storageBucket: "cryptoeagle-3146b.appspot.com",
    messagingSenderId: "633260857508",
    appId: "1:633260857508:web:7720acbed75dcec0b02e31",
    measurementId: "G-0H8T9ZL7X7"
  };

  // Initialize Firebase
 firebase.initializeApp(firebaseConfig);
 const analytics = getAnalytics(initializeApp(firebaseConfig));
