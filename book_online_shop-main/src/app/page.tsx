"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { fetchCategories } from "@/lib/categories";

type Category = {
  id: string;
  name: string;
  description: string;
};

const featuredBooks = [
  { title: "Clean Code", author: "Robert C. Martin", price: "$24.99" },
  { title: "Atomic Habits", author: "James Clear", price: "$18.99" },
  { title: "The Pragmatic Programmer", author: "Andrew Hunt", price: "$29.99" },
];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center gap-8 py-10">
            <div className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm">
              Discover your next favorite book
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                A modern bookstore experience for every reader.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                Browse categories, explore featured titles, manage your cart,
                and checkout with ease. Built with Next.js, Firebase, and
                Tailwind CSS.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/books"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Shop Books
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Sign In
              </Link>
            </div>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-slate-800 to-slate-950 p-8 text-white shadow-2xl sm:p-10">
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-300">
                  Bestsellers
                </p>
                <h2 className="mt-2 text-3xl font-semibold">
                  Top picks this week
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {featuredBooks.map((book) => (
                  <div key={book.title} className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm text-slate-300">{book.author}</p>
                    <h3 className="mt-3 text-xl font-semibold">{book.title}</h3>
                    <p className="mt-4 text-lg font-semibold text-slate-100">
                      {book.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Browse by category</h2>
            <Link
              href="/books"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              View all
            </Link>
          </div>
          {isLoading ? (
            <div className="mt-6 text-center text-slate-600">
              Loading categories...
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/books?category=${category.id}`}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="text-base font-semibold text-slate-900 group-hover:text-slate-700">
                    {category.name}
                  </p>
                  <p className="mt-3 text-sm text-slate-500">
                    {category.description}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
