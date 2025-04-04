import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const serviceAccount = require('./service.json')

const initFirebaseAdmin = () => {
    const apps = getApps();
    if (!apps.length) {
        initializeApp({
            credential:cert(serviceAccount)
        })
    }

    return {
        auth: getAuth(),
        db: getFirestore(),
    };
};

export const { auth,db }  = initFirebaseAdmin();