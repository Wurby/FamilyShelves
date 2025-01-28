import type { Shelf as ShelfType } from "./auth";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  arrayUnion,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

type FirestoreShelf = Omit<ShelfType, "createdAt" | "items"> & {
  createdAt: Timestamp;
  items?: Array<
    Omit<ShelfType["items"][number], "createdAt" | "expirationDate"> & {
      createdAt: Timestamp;
      expirationDate: Timestamp;
    }
  >;
};

type Shelf = ShelfType & {
  id: string;
};

function convertFirestoreShelf(doc: FirestoreShelf & { id: string }): Shelf {
  return {
    ...doc,
    createdAt: doc.createdAt.toDate(),
    items: (doc.items || []).map((item) => ({
      ...item,
      createdAt: item.createdAt.toDate(),
      expirationDate: item.expirationDate.toDate(),
    })),
  };
}

// Get all shelves for a user
export async function getUserShelves(userId: string): Promise<Shelf[]> {
  const shelvesRef = collection(db, "users", userId, "shelves");
  const shelvesSnapshot = await getDocs(shelvesRef);

  return shelvesSnapshot.docs.map((doc) =>
    convertFirestoreShelf({
      id: doc.id,
      ...(doc.data() as FirestoreShelf),
    })
  );
}

// Get a single shelf by ID
export async function getShelf(
  userId: string,
  shelfId: string
): Promise<Shelf | null> {
  const shelfRef = doc(db, "users", userId, "shelves", shelfId);
  const shelfDoc = await getDoc(shelfRef);

  if (!shelfDoc.exists()) {
    return null;
  }

  return convertFirestoreShelf({
    id: shelfDoc.id,
    ...(shelfDoc.data() as FirestoreShelf),
  });
}

interface NewShelf {
  name: string;
  settings?: {
    defaultUnit: string;
    defaultQuantity: number;
    defaultExpirationDate: number;
    defaultLocation?: string;
  };
}

export async function createShelf(
  userId: string,
  shelfData: NewShelf
): Promise<string> {
  const shelvesRef = collection(db, "users", userId, "shelves");

  const newShelf = {
    ...shelfData,
    items: [],
    createdAt: new Date(),
    settings: {
      defaultUnit: "each",
      defaultQuantity: 1,
      defaultExpirationDate: 7, // days
      defaultLocation: "",
      ...shelfData.settings,
    },
  };

  const docRef = await addDoc(shelvesRef, newShelf);
  return docRef.id;
}

interface NewItem {
  name: string;
  quantity: number;
  unit: string;
  expirationDate: Date;
  notes?: string;
  location?: string;
}

export async function addItemToShelf(
  userId: string,
  shelfId: string,
  item: NewItem
): Promise<void> {
  const shelfRef = doc(db, "users", userId, "shelves", shelfId);

  // Create a new object with only defined values
  const newItem: Record<string, any> = {
    name: item.name,
    quantity: item.quantity,
    unit: item.unit,
    expirationDate: item.expirationDate,
    createdAt: new Date(),
  };

  // Only add optional fields if they are defined
  if (item.notes !== undefined) newItem["notes"] = item.notes;
  if (item.location !== undefined) newItem["location"] = item.location;

  await updateDoc(shelfRef, {
    items: arrayUnion(newItem),
  });
}

export async function deleteShelf(
  userId: string,
  shelfId: string
): Promise<void> {
  const shelfRef = doc(db, "users", userId, "shelves", shelfId);
  await deleteDoc(shelfRef);
}
