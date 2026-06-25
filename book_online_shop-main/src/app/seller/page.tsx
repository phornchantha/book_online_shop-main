"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import useFirebaseAuth from "@/lib/useFirebaseAuth";

export default function SellerPage() {
  const { userRole, user, isLoaded } = useFirebaseAuth();
  const router = useRouter();
  const [bookCount, setBookCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && userRole === "admin") {
      router.push("/");
    }
  }, [isLoaded, userRole, router]);

  useEffect(() => {
    const loadSellerStats = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const q = query(
          collection(db, "books"),
          where("sellerId", "==", user.uid),
        );
        const querySnapshot = await getDocs(q);

        let totalPrice = 0;
        querySnapshot.forEach((doc) => {
          const book = doc.data();
          totalPrice += book.price || 0;
        });

        setBookCount(querySnapshot.size);
        setTotalSales(totalPrice);
      } catch (error) {
        console.error("Error loading seller stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSellerStats();
  }, [user]);

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Seller Dashboard</h1>
              <p className="mt-2 text-slate-600">
                Manage your book listings, sales, and orders.
              </p>
            </div>
            <Link
              href="/seller/add-book"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Add New Book
            </Link>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                My Books
              </p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">
                {isLoading ? "..." : bookCount}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                Total Books Value
              </p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">
                {isLoading ? "..." : `$${totalSales.toFixed(2)}`}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                Total Orders
              </p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">0</p>
            </div>
          </div>
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-slate-900">My Books</h2>
            <Link
              href="/seller/my-books"
              className="mt-4 inline-block rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              View All Books
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
