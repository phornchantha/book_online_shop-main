"use client";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function uploadBookImage(
  file: File,
  bookId: string,
): Promise<string> {
  try {
    const storageRef = ref(storage, `books/${bookId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}

export async function deleteBookImage(imageUrl: string): Promise<void> {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
}

export function getPlaceholderImage(bookTitle: string): string {
  // Use a placeholder service for book covers
  return `https://via.placeholder.com/300x400?text=${encodeURIComponent(bookTitle)}`;
}
