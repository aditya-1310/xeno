// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBATSgEl3k8O5n2Fn7R9-PbQKG_EuMnP_o",
  authDomain: "xeno-crm-ae680.firebaseapp.com",
  projectId: "xeno-crm-ae680",
  storageBucket: "xeno-crm-ae680.firebasestorage.app",
  messagingSenderId: "1028254529357",
  appId: "1:1028254529357:web:84625a8ddd6d4cdd46a904"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;