import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";

import { FIRESTORE_COLLECTIONS } from "@/database/firestoreCollections";
import { db } from "@/lib/firebase/client";

export async function getFlashcardCollections(userId) {
  const userDocRef = getUserDocument(userId);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    return docSnap.data().flashcards || [];
  }

  await setDoc(userDocRef, { flashcards: [] });
  return [];
}

export async function getFlashcardsByCollection(userId, collectionName) {
  const colRef = collection(getUserDocument(userId), collectionName);
  const docs = await getDocs(colRef);
  const flashcards = [];

  docs.forEach((document) => {
    flashcards.push({ id: document.id, ...document.data() });
  });

  return flashcards;
}

export async function saveFlashcardCollection({ userId, name, flashcards }) {
  const batch = writeBatch(db);
  const userDocRef = getUserDocument(userId);
  const docSnap = await getDoc(userDocRef);
  const existingCollections = docSnap.exists()
    ? docSnap.data().flashcards || []
    : [];

  if (existingCollections.find((collection) => collection.name === name)) {
    throw new Error("Flashcard collection with the same name already exists.");
  }

  batch.set(
    userDocRef,
    { flashcards: [...existingCollections, { name }] },
    { merge: true }
  );

  const colRef = collection(userDocRef, name);
  flashcards.forEach((flashcard) => {
    const cardDocRef = doc(colRef);
    batch.set(cardDocRef, flashcard);
  });

  await batch.commit();
}

export async function deleteFlashcardCollection({ userId, name }) {
  const batch = writeBatch(db);
  const userDocRef = getUserDocument(userId);
  const docSnap = await getDoc(userDocRef);
  const existingCollections = docSnap.exists()
    ? docSnap.data().flashcards || []
    : [];
  const nextCollections = existingCollections.filter(
    (collection) => collection.name !== name,
  );

  batch.set(userDocRef, { flashcards: nextCollections }, { merge: true });

  const colRef = collection(userDocRef, name);
  const docs = await getDocs(colRef);

  docs.forEach((document) => {
    batch.delete(document.ref);
  });

  await batch.commit();
}

function getUserDocument(userId) {
  return doc(collection(db, FIRESTORE_COLLECTIONS.users), userId);
}
