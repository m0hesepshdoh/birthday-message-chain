import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA0wcgv_6dH14g37F6fdqXv1A97amw23_w',
  authDomain: 'birthdaymessagesapp.firebaseapp.com',
  projectId: 'birthdaymessagesapp',
  storageBucket: 'birthdaymessagesapp.firebasestorage.app',
  messagingSenderId: '220266164498',
  appId: '1:220266164498:web:2adcb2520b75f580cd83cb',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
