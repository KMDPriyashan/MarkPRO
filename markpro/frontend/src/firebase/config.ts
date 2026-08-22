import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCbA5VqNarJLvPLusKWM0RUsVQeobXKeJ4",
  authDomain: "markpro-149f3.firebaseapp.com",
  projectId: "markpro-149f3",
  storageBucket: "markpro-149f3.firebasestorage.app",
  messagingSenderId: "1009844809931",
  appId: "1:1009844809931:web:81c4b0091839cfa9952b4e",
  measurementId: "G-52QNQ7MWC0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth functions
export const loginWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();
  return { user: userCredential.user, token };
};

export const registerWithEmail = async (
  email: string,
  password: string,
  name: string
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: name });
  const token = await userCredential.user.getIdToken();
  return { user: userCredential.user, token };
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const getCurrentUser = (): Promise<any> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};