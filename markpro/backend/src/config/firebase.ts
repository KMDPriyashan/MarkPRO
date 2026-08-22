import dotenv from 'dotenv';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();

const looksLikePlaceholder = (value?: string) =>
  !value || /your-project-id|your private key|example|replace-me|dummy/i.test(value);

const hasValidFirebaseConfig =
  !!projectId && !looksLikePlaceholder(projectId) &&
  !!privateKey && privateKey.includes('BEGIN PRIVATE KEY') &&
  !!clientEmail && !looksLikePlaceholder(clientEmail);

// Export flag to indicate if Firebase is properly initialized
export const isFirebaseInitialized = hasValidFirebaseConfig;

const createUnavailableService = (serviceName: string) =>
  new Proxy(
    {},
    {
      get() {
        return () => {
          throw new Error(
            `Firebase ${serviceName} is not configured. Add real FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL values to the backend .env file.`
          );
        };
      },
    }
  );

if (!getApps().length && hasValidFirebaseConfig) {
  try {
    initializeApp({
      credential: cert({
        projectId,
        privateKey,
        clientEmail,
      } as any),
      storageBucket: `${projectId}.appspot.com`,
    });
  } catch (error) {
    console.warn('Invalid Firebase credentials detected. Starting without Firebase services.', error);
  }
} else if (!getApps().length) {
  console.warn(
    'ℹ️  Firebase is not configured. Auth will operate in DEVELOPMENT MODE.'
  );
}

export const firebaseAuth = getApps().length ? getAuth() : (createUnavailableService('auth') as any);
export const firebaseStorage = getApps().length ? getStorage() : (createUnavailableService('storage') as any);
export const firebaseFirestore = getApps().length ? getFirestore() : (createUnavailableService('firestore') as any);
