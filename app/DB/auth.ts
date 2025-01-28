import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  type UserCredential,
} from "firebase/auth";
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
import { addDays } from "~/utils/Date";

export interface UserData {
  name: string;
  uid: string;
  shelves: Shelf[];
  createdAt: Date;
}

export type Shelf = {
  name: string;
  settings: {
    defaultUnit: string;
    defaultQuantity: number;
    defaultExpirationDate: number;
    defaultLocation?: string;
  };
  items: Item[];
  createdAt: Date;
};

export type Item = {
  name: string;
  quantity: number;
  unit: string;
  createdAt: Date;
  expirationDate: Date;
  notes?: string;
  location?: string;
};

interface SignupData {
  email: string;
  password: string;
  name: string;
}

async function createUserDocument(uid: string, name: string) {
  const userRef = doc(db, "users", uid);
  const shelvesCollectionRef = collection(userRef, "shelves");

  await setDoc(userRef, {
    name: name,
    uid: uid,
    createdAt: new Date(),
  });

  // Create initial pantry shelves
  await setDoc(doc(shelvesCollectionRef, "pantry"), {
    name: "Pantry",
    items: [
      {
        name: "Apples",
        quantity: 10,
        unit: "each",
        createdAt: new Date(),
        expirationDate: addDays(new Date(), 7),
      },
    ],
    createdAt: new Date(),
  });

  await setDoc(doc(shelvesCollectionRef, "fridge"), {
    name: "Fridge",
    items: [
      {
        name: "Milk",
        quantity: 1,
        unit: "each",
        createdAt: new Date(),
        expirationDate: addDays(new Date(), 7),
      },
    ],
    createdAt: new Date(),
  });
}

export async function signup({
  email,
  password,
  name,
}: SignupData): Promise<UserCredential> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email.trim().toLowerCase(),
    password
  );

  if (userCredential.user) {
    await updateProfile(userCredential.user, {
      displayName: name.trim(),
    });

    // Create the user document in Firestore
    await createUserDocument(userCredential.user.uid, name.trim());
  }

  return userCredential;
}

export async function login(
  email: string,
  password: string
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logout(): Promise<void> {
  return signOut(auth);
}
