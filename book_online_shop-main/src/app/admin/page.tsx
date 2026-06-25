"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import useFirebaseAuth from "@/lib/useFirebaseAuth";

export default function AdminPage() {
  const { userRole, isLoaded } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && userRole !== "admin") {
      router.push("/");
    }
  }, [isLoaded, userRole, router]);

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

  if (userRole !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <p className="mt-2 text-slate-600">
            Monitor and manage the bookstore collection and system.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/books"
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center transition hover:bg-slate-100"
            >
              <p className="text-lg font-semibold text-slate-900">
                Book Management
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Add or delete books from Firestore.
              </p>
            </Link>
            <Link
              href="/admin/categories"
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center transition hover:bg-slate-100"
            >
              <p className="text-lg font-semibold text-slate-900">
                Category Management
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Create and delete book categories.
              </p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
