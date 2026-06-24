import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type CartItem = {
  id: string;
  bookId: string;
  userId: string;
  quantity: number;
  title: string;
  price: number;
};

export async function fetchCartItems(userId: string) {
  const cartQuery = query(
    collection(db, "cart"),
    where("userId", "==", userId),
    orderBy("title"),
  );
  const snapshot = await getDocs(cartQuery);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as CartItem[];
}

export async function addToCart(item: Omit<CartItem, "id">) {
  const docRef = await addDoc(collection(db, "cart"), item);
  return docRef.id;
}

export async function updateCartItem(itemId: string, quantity: number) {
  await updateDoc(doc(db, "cart", itemId), { quantity });
}

export async function removeCartItem(itemId: string) {
  await deleteDoc(doc(db, "cart", itemId));
}
