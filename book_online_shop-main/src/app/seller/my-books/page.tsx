"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useFirebaseAuth from "@/lib/useFirebaseAuth";
import { toast } from "react-hot-toast";

type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  imageUrl: string;
  sellerId: string;
};

export default function MyBooksPage() {
  const { userRole, user, isLoaded } = useFirebaseAuth();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && userRole === "admin") {
      router.push("/");
    }
  }, [isLoaded, userRole, router]);

  useEffect(() => {
    if (user) {
      loadBooks();
    }
  }, [user]);

  const loadBooks = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const q = query(
        collection(db, "books"),
        where("sellerId", "==", user.uid),
      );
      const querySnapshot = await getDocs(q);

      const booksData: Book[] = [];
      querySnapshot.forEach((doc) => {
        booksData.push({
          id: doc.id,
          ...doc.data(),
        } as Book);
      });

      setBooks(booksData);
    } catch (error) {
      console.error("Error loading books:", error);
      toast.error("Failed to load books");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (bookId: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteDoc(doc(db, "books", bookId));
        setBooks(books.filter((book) => book.id !== bookId));
        toast.success("Book deleted successfully");
      } catch (error) {
        console.error("Error deleting book:", error);
        toast.error("Failed to delete book");
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-slate-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (userRole === "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold">My Books</h1>
              <p className="mt-2 text-slate-600">
                Manage your book listings and inventory.
              </p>
            </div>
            <Link
              href="/seller/add-book"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Add New Book
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-slate-600">Loading books...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-600 mb-4">
                You haven't added any books yet.
              </p>
              <Link
                href="/seller/add-book"
                className="inline-block rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Add Your First Book
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                      Title
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                      Author
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                      Price
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                      Stock
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr
                      key={book.id}
                      className="border-b border-slate-200 hover:bg-slate-50"
                    >
                      <td className="px-4 py-4 text-sm text-slate-900">
                        {book.title}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {book.author}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                        ${book.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-900">
                        {book.stock}
                      </td>
                      <td className="px-4 py-4 text-sm space-x-2">
                        <Link
                          href={`/seller/edit-book/${book.id}`}
                          className="inline-block rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="inline-block rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
