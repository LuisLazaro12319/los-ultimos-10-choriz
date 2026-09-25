import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

/**
 * Config publica del proyecto Firebase (segura de exponer en el bundle:
 * el acceso real lo controlan las reglas de Firestore/Auth, no esta clave).
 * Se completa con NEXT_PUBLIC_FIREBASE_* en .env.local (ver .env.example).
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firestore no valida la config de forma sincronica, asi que esto es seguro
// aunque las variables de entorno todavia no esten cargadas (la tienda publica
// solo necesita esto, nunca "auth").
export const db = getFirestore(app);

// getAuth() SI valida el apiKey al instante y tira una excepcion si esta mal
// configurado. Se deja como funcion (no como constante a nivel de modulo) para
// que un error de configuracion de Firebase solo rompa el panel admin, nunca
// la tienda publica que ven los clientes.
export function getFirebaseAuth() {
  return getAuth(app);
}
