import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDDNljinoDCCFruLB_z6nr33JpMJJsZUnI",
    authDomain: "very-hot-burgers-6d0b5.firebaseapp.com",
    databaseURL: "https://very-hot-burgers-6d0b5-default-rtdb.firebaseio.com",
});

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };
export default base;