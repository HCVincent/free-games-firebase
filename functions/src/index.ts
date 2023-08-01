import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();
export const createUserDocument = functions.auth.user().onCreate(async (user) => {
    const newUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        providerData: user.providerData,
    }
    db.collection("users").doc(user.uid).set(newUser);
});

// exports.createGameRecommendations = onDocumentWritten("recommendations/{id}", (event) => {
//     // Your code here
//     const snapshot = event.data;
//     if (!snapshot) {
//         console.log("No snapshot associated with the event");
//         return;
//     }
//     const data = snapshot.after.data();
//     if (!data) {
//         console.log("No data associated with the event");
//         return;
//     }
//     // access a particular field as you would any JS property
//     const newRecommendation = {
//         id: data.id,
//         title: data.title,
//         body: data.body,
//         coverImage: data.coverImage ? data.coverImage : null,
//         imagesGroup: data.imagesGroup ? data.imagesGroup : null,
//         video: data.video ? data.video : null,
//         createdAt: data.createdAt,
//         updatedAt: data.updatedAt
//     }
//     db.collection("games").doc(newRecommendation.id).set(newRecommendation);
// });