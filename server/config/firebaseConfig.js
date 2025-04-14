import admin from 'firebase-admin';

import { createRequire } from 'module';

// Use createRequire to import JSON in CommonJS
const require = createRequire(import.meta.url);
const serviceAccount = require('./q2-commerce-firebase-adminsdk-fbsvc-80326e6255.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), 
  databaseURL: 'https://q2-commerce.firebaseio.com',
});

const db = admin.firestore();

export default { admin, db };



// import serviceAccount from './future-logic-e-commerce-firebase-adminsdk-fbsvc-abb28c8f24.json' assert { type: 'json' };

// import admin, { initializeApp, credential as _credential } from 'firebase-admin';
// import serviceAccount from '../path/to/firebase-key.json';

// initializeApp({
//   credential: _credential.cert(serviceAccount),
//   databaseURL: 'https://<your-database-name>.firebaseio.com',
// });


// import { initializeApp, credential as _credential, firestore } from 'firebase-admin';
// import serviceAccount from './serviceAccountKey.json'; // Path to your key file

// initializeApp({
//   credential: _credential.cert(serviceAccount),
//   databaseURL: 'https://<YOUR_PROJECT_ID>.firebaseio.com',
// });

// const db = firestore();
// export default { admin, db };
