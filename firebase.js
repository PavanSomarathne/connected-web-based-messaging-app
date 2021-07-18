import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCVM1GjwCAbV1ZOdyYntPUaROlGF-sttZI",
  authDomain: "connected-77b9d.firebaseapp.com",
  projectId: "connected-77b9d",
  storageBucket: "connected-77b9d.appspot.com",
  messagingSenderId: "198581428666",
  appId: "1:198581428666:web:2242fc504d1e5c0c9f3d83",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

  const db=app.firestore();
  const auth=app.auth();
  const provider=new firebase.auth.GoogleAuthProvider();

  export{db,auth,provider};