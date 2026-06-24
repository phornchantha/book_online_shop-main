import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  categoryId: string;
  sellerId: string;
  description: string;
  imageUrl?: string;
};

export async function fetchBooks(category?: string) {
  const booksCollection = collection(db, "books");
  const q = category
    ? query(
        booksCollection,
        where("categoryId", "==", category),
        orderBy("title"),
      )
    : query(booksCollection, orderBy("title"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Book[];
}

export async function fetchBookById(bookId: string) {
  const bookDoc = await getDoc(doc(db, "books", bookId));
  if (!bookDoc.exists()) return null;
  return { id: bookDoc.id, ...bookDoc.data() } as Book;
}

export async function createBook(book: Omit<Book, "id">) {
  const docRef = await addDoc(collection(db, "books"), book);
  return docRef.id;
}

export async function updateBook(bookId: string, changes: Partial<Book>) {
  await updateDoc(doc(db, "books", bookId), changes);
}

export async function deleteBook(bookId: string) {
  await deleteDoc(doc(db, "books", bookId));
}
