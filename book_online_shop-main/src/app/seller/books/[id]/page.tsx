"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useFirebaseAuth from "@/lib/useFirebaseAuth";
import { addToCart } from "@/lib/cart";
import { toast } from "react-hot-toast";

type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  sellerName: string;
  sellerId: string;
  isbn?: string;
  pages?: number;
  publishedYear?: number;
};

export default function SellerBookDetailPage() {
  const { userRole, user, isLoaded } = useFirebaseAuth();
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isLoaded && userRole === "admin") {
      router.push("/");
    }
  }, [isLoaded, userRole, router]);

  useEffect(() => {
    const loadBook = async () => {
      if (!bookId) return;

      try {
        setIsLoading(true);
        const bookDoc = await getDoc(doc(db, "books", bookId));

        if (!bookDoc.exists()) {
          toast.error("Book not found");
          router.push("/seller/books");
          return;
        }

        setBook({
          id: bookDoc.id,
          ...bookDoc.data(),
        } as Book);
      } catch (error) {
        console.error("Error loading book:", error);
        toast.error("Failed to load book details");
      } finally {
        setIsLoading(false);
      }
    };

    loadBook();
  }, [bookId, router]);

  const handleAddToCart = async () => {
    if (!user || !book) return;

    try {
      setIsAddingToCart(true);
      await addToCart({
        userId: user.uid,
        bookId: book.id,
        title: book.title,
        price: book.price,
        quantity,
      });
      toast.success("Added to cart!");
      setQuantity(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-slate-600">Loading book details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/seller/books"
            className="text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            ← Back to All Books
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Book Image */}
            <div className="lg:col-span-1">
              {book.imageUrl && (
                <div className="rounded-3xl bg-slate-100 overflow-hidden">
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Book Details */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-slate-900">
                {book.title}
              </h1>
              <p className="mt-2 text-lg text-slate-600">{book.author}</p>

              {/* Seller Info */}
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Seller</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {book.sellerName}
                </p>
              </div>

              {/* Price and Stock */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Price</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    ${book.price.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Stock Available</p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-3xl font-bold text-slate-900">
                      {book.stock}
                    </p>
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
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {book.isbn && (
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-600">ISBN</p>
                    <p className="mt-1 font-mono text-slate-900">{book.isbn}</p>
                  </div>
                )}
                {book.pages && (
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-600">Pages</p>
                    <p className="mt-1 text-slate-900">{book.pages}</p>
                  </div>
                )}
                {book.publishedYear && (
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-600">Published Year</p>
                    <p className="mt-1 text-slate-900">{book.publishedYear}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mt-6 rounded-2xl bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-700">
                  Description
                </p>
                <p className="mt-3 text-slate-700 leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Tip */}
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-blue-50 p-6 border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>💡 Market Insight:</strong> Use this information to
                    benchmark your pricing and offerings against competitors.
                  </p>
                </div>

                {/* Buy Section */}
                {user?.uid === book.sellerId ? (
                  <div className="rounded-2xl bg-slate-100 p-6 border border-slate-300">
                    <p className="text-sm text-slate-700 font-semibold">
                      ℹ️ This is your book
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      You cannot purchase books that you're selling. Manage your
                      inventory in the "My Books" section.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-green-50 p-6 border border-green-200">
                    <p className="text-sm text-green-700 font-semibold mb-4">
                      Want to buy this book?
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-green-900 font-medium mb-2">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={book.stock}
                          value={quantity}
                          onChange={(e) =>
                            setQuantity(
                              Math.max(1, parseInt(e.target.value) || 1),
                            )
                          }
                          disabled={book.stock === 0}
                          className="w-full rounded-full border border-green-300 bg-white px-4 py-2 text-sm font-semibold text-green-900 outline-none"
                        />
                      </div>

                      <button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart || book.stock === 0}
                        className="w-full rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isAddingToCart
                          ? "Adding..."
                          : book.stock === 0
                            ? "Out of Stock"
                            : "Add to Cart"}
                      </button>

                      <Link
                        href="/cart"
                        className="block w-full rounded-full border border-green-300 px-4 py-2 text-center text-sm font-semibold text-green-700 transition hover:bg-green-100"
                      >
                        View Cart
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
