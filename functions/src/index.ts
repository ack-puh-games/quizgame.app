import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const firestore = admin.firestore();

export const onNewUser = functions.auth.user().onCreate((user) => {
  return firestore.collection('users').doc(user.uid).set(
    {
      displayName: user.displayName,
      email: user.email,
      creationTime: user.metadata.creationTime,
      profileImageUrl: user.photoURL,
    },
    { merge: true },
  );
});

export const onNewGame = functions.database
  .ref('/games/{gameId}')
  .onCreate(async (snapshot) => {
    const boardId = snapshot.val().board;
    const boardRef = firestore.collection('boards').doc(boardId);
    const questionsRef = boardRef.collection('questions');

    const gameQuestionsRef = snapshot.child('questions').ref;

    const questions = await questionsRef.get();

    return questions.forEach(async (qDoc) => {
      const qId = qDoc.id;
      const qData = qDoc.data();

      await gameQuestionsRef.child(qId).set({
        categoryId: qData.categoryId,
        value: qData.value,
      });
    });
  });
