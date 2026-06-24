import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Category = {
  id: string;
  name: string;
  description: string;
};

export async function fetchCategories() {
  const snapshot = await getDocs(collection(db, "categories"));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Category[];
}

export async function createCategory(category: Omit<Category, "id">) {
  const docRef = await addDoc(collection(db, "categories"), category);
  return docRef.id;
}

export async function updateCategory(
  categoryId: string,
  changes: Partial<Category>,
) {
  await updateDoc(doc(db, "categories", categoryId), changes);
}

export async function deleteCategory(categoryId: string) {
  await deleteDoc(doc(db, "categories", categoryId));
}
