import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const ONE_HOUR = 1000 * 60 * 60;
const TWO_HOURS = ONE_HOUR * 2;

admin.initializeApp();

const firestore = admin.firestore();
const database = admin.database();

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

export const onNewCurrentQuestion = functions.database
  .ref('/games/{gameId}/currentQuestion')
  .onCreate(async (snapshot) => {
    // is there an easier way to get the board id here?
    return snapshot.ref.parent
      ?.child('board')
      .once('value')
      .then((boardIdSnapshot) => {
        const boardRef = firestore
          .collection('boards')
          .doc(boardIdSnapshot.val());

        const { questionId } = snapshot.val();

        const questionRef = boardRef.collection('questions').doc(questionId);

        return questionRef.get();
      })
      .then((questionDoc) => {
        const qData = questionDoc.data();

        if (qData) {
          return snapshot.ref.child('questionText').set(qData.question);
        }

        return null;
      });
  });

// run every hour at the top of the hour.
export const clearExpiredGames = functions
  .runWith({
    timeoutSeconds: 10,
    memory: '128MB',
  })
  .pubsub.schedule('0 * * * *')
  .onRun(() => {
    const gamesRef = database.ref('/games');

    return gamesRef.orderByChild('createdAt').on('child_added', (snapshot) => {
      const createdAt = snapshot.child('createdAt').val();

      if (Date.now() - createdAt >= TWO_HOURS) {
        snapshot.ref.remove();
      }
    });
  });
