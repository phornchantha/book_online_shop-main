"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { collection, getDocs, query } from "firebase/firestore";
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
  category: string;
  imageUrl: string;
  sellerName: string;
};

type Category = {
  id: string;
  name: string;
};

export default function SellerBooksPage() {
  const { userRole, isLoaded } = useFirebaseAuth();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && userRole === "admin") {
      router.push("/");
    }
  }, [isLoaded, userRole, router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load all books
        const booksSnapshot = await getDocs(collection(db, "books"));
        const booksData: Book[] = [];
        booksSnapshot.forEach((doc) => {
          booksData.push({
            id: doc.id,
            ...doc.data(),
          } as Book);
        });
        setBooks(booksData);

        // Load categories
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const categoriesData: Category[] = [];
        categoriesSnapshot.forEach((doc) => {
          categoriesData.push({
            id: doc.id,
            ...doc.data(),
          } as Category);
        });
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load books");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter books based on search term and category
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          <h1 className="text-3xl font-semibold">All Books on Platform</h1>
          <p className="mt-2 text-slate-600">
            Browse all books available on the marketplace and view competitor
            offerings.
          </p>

          {/* Search and Filter Section */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Search Books
              </label>
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Link
                href="/seller/my-books"
                className="w-full rounded-full bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                My Books
              </Link>
            </div>
          </div>

          {/* Books Display */}
          {isLoading ? (
            <div className="mt-10 text-center py-10">
              <p className="text-slate-600">Loading books...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="mt-10 text-center py-10">
              <p className="text-slate-600">
                {searchTerm || selectedCategory
                  ? "No books found matching your filters."
                  : "No books available yet."}
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md transition hover:shadow-lg"
                >
                  {book.imageUrl && (
                    <div className="mb-4 h-40 w-full overflow-hidden rounded-2xl bg-slate-100">
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{book.author}</p>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-1">
                    By {book.sellerName}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        ${book.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-500">
                        Stock: {book.stock}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        book.stock > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {book.stock > 0 ? "In Stock" : "Out"}
                    </span>
                  </div>

                  <Link
                    href={`/seller/books/${book.id}`}
                    className="mt-4 block w-full rounded-full bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 rounded-2xl bg-blue-50 p-6 border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>💡 Tip:</strong> Use this page to research competitor
              pricing, popular books, and market trends. Visit{" "}
              <Link
                href="/seller/my-books"
                className="font-semibold underline hover:text-blue-700"
              >
                My Books
              </Link>{" "}
              to manage your own listings.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
