import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const firestoreDB = admin.firestore();

export const onNewUser = functions.auth.user().onCreate((user) => {
  return firestoreDB.collection('users')
    .doc(user.uid)
    .set(
      {
        displayName: user.displayName,
        email: user.email,
        creationTime: user.metadata.creationTime,
        profileImageUrl: user.photoURL,

      },
      { merge: true }
    );
});
