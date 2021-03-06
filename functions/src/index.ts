import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as firestoreAdmin from '@google-cloud/firestore';

const ONE_HOUR = 1000 * 60 * 60;
const firebaseOutputPathBase = 'gs://quiz-akp-tools.appspot.com/backups';
const firestoreAdminClient = new firestoreAdmin.v1.FirestoreAdminClient();

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
          return snapshot.ref.set({
            createdAt: admin.database.ServerValue.TIMESTAMP,
            questionId: snapshot.val().questionId,
            questionText: qData.question,
            questionValue: qData.value,
          });
        }

        return null;
      });
  });

export const onQuestionUnlock = functions.database
  .ref('/games/{gameId}/currentQuestion/isUnlocked')
  .onCreate(async (snapshot) => {
    return snapshot.ref.parent
      ?.child('unlockedAt')
      .set(admin.database.ServerValue.TIMESTAMP);
  });

export const onQuestionBuzzer = functions.database
  .ref('/games/{gameId}/currentQuestion/buzzer')
  .onCreate(async (snapshot) => {
    return snapshot.ref.parent
      ?.child('buzzedAt')
      .set(admin.database.ServerValue.TIMESTAMP);
  });

export const onQuestionDead = functions.database
  .ref('/games/{gameId}/currentQuestion/isDead')
  .onCreate(async (snapshot) => {
    return snapshot.ref.parent?.remove();
  });

export const onQuestionAnswered = functions.database
  .ref('/games/{gameId}/currentQuestion/isCorrect')
  .onCreate(async (snapshot) => {
    const isCorrect = snapshot.val();

    // get the player ID of the last buzzer
    const getPlayerId = snapshot.ref.parent
      ?.child('buzzer')
      .once('value')
      .then((v) => v?.val());

    // get the value of the question
    const getQuestionValue = snapshot.ref.parent
      ?.child('questionValue')
      .once('value')
      .then((v) => v?.val());

    // lump everything together
    return Promise.all([getPlayerId, getQuestionValue])
      .then(([playerId, questionValue]) => {
        // find the buzzer's current score ref
        const playerScoreRef = snapshot.ref.parent?.parent
          ?.child('players')
          ?.child(playerId)
          ?.child('currentScore');

        // get the current score value, pass on to next .then
        return Promise.all([
          playerScoreRef?.once('value').then((v) => v?.val()),
          playerScoreRef,
          questionValue,
        ]);
      })
      .then(([playerScore, playerScoreRef, questionValue]) => {
        // if correct, new score is current + value, else current - value.
        if (isCorrect) {
          return playerScoreRef?.set(playerScore + questionValue);
        } else {
          return playerScoreRef?.set(playerScore - questionValue);
        }
      })
      .then(() => {
        // if correct, clear currentQuestion
        if (isCorrect) {
          return snapshot.ref.parent?.remove();
        } else {
          // if incorrect, clear buzzer info and add player to failedContestants
          return Promise.resolve(getPlayerId).then((playerId) =>
            Promise.all([
              snapshot.ref.parent
                ?.child('unlockedAt')
                .set(admin.database.ServerValue.TIMESTAMP),
              snapshot.ref.parent?.child('buzzedAt').remove(),
              snapshot.ref.parent?.child('buzzer').remove(),
              snapshot.ref.parent?.child('isCorrect').remove(),
              snapshot.ref.parent
                ?.child('failedContestants')
                .child(playerId)
                .set(true),
            ]),
          );
        }
      });
  });

export const onNewPlayer = functions.database
  .ref('/games/{gameId}/players/{playerId}')
  .onCreate(async (snapshot) => {
    return snapshot.ref.child('currentScore').set(0);
  });

export const onNewFailedContestant = functions.database
  .ref('/games/{gameId}/currentQuestion/failedContestants/{playerId}')
  .onCreate(async (snapshot) => {
    const getConnectedPlayersCount =
      snapshot.ref.parent?.parent?.parent
        ?.child('players')
        .once('value')
        .then((v) => v.val())
        .then((o) => Object.values(o).filter((v: any) => v.connected))
        .then((v) => v.length) || 0;

    const getFailedContestantsCount =
      snapshot.ref.parent
        ?.once('value')
        .then((v) => v.val())
        .then((o) => Object.values(o))
        .then((v) => v.length) || 0;

    return Promise.all([
      getConnectedPlayersCount,
      getFailedContestantsCount,
    ]).then(([connectedPlayersCount, failedContestantsCount]) => {
      // eslint-disable-next-line no-console
      console.log({ connectedPlayersCount, failedContestantsCount });
      if (failedContestantsCount >= connectedPlayersCount) {
        return snapshot.ref.parent?.parent?.remove();
      }

      return;
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

      if (Date.now() - createdAt >= ONE_HOUR * 5) {
        snapshot.ref.remove();
      }
    });
  });

export const backupFirestore = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '128MB',
  })
  .pubsub.schedule('0 0 * * *')
  .onRun(() => {
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
    const name = firestoreAdminClient.databasePath(projectId, '(default)');
    const outputUriPrefix = `${firebaseOutputPathBase}/${new Date().toISOString()}`;

    return firestoreAdminClient
      .exportDocuments({
        name,
        outputUriPrefix,
        collectionIds: [],
      })
      .catch((err: Error) => {
        // eslint-disable-next-line no-console
        console.error(err);
        throw new Error('Export operation failed');
      });
  });
