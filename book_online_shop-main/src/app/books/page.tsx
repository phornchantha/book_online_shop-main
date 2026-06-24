"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Book, fetchBooks } from "@/lib/books";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "react-hot-toast";

const initialBooks: Book[] = [];

export default function BooksPage() {
  const searchParams = useSearchParams();
  const category = searchParams?.get("category") || "";
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const list = await fetchBooks(category || undefined);
        setBooks(list);
      } catch (error) {
        toast.error("Unable to load books.");
      } finally {
        setIsLoading(false);
      }
    };
    loadBooks();
  }, [category]);

  const filteredBooks = useMemo(
    () =>
      books.filter((book) => {
        const query = search.toLowerCase();
        return (
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
        );
      }),
    [books, search],
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Books</h1>
            <p className="mt-2 text-sm text-slate-600">
              Search by title, author, or category.
            </p>
          </div>
          <div className="w-full max-w-sm">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search books..."
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </header>

        <section className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600">
              Loading books...
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600">
              No books found.
            </div>
          ) : (
            filteredBooks.map((book) => {
              const imageUrl =
                book.imageUrl ||
                `https://via.placeholder.com/300x400/1E293B/FFFFFF?text=${encodeURIComponent(
                  book.title,
                )}`;

              return (
                <article
                  key={book.id}
                  className="rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md overflow-hidden"
                >
                  <div className="relative w-full h-56 bg-slate-100">
                    <img
                      src={imageUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-slate-900">
                          {book.title}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                          {book.author}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 whitespace-nowrap">
                        ${book.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600 line-clamp-2">
                      {book.description}
                    </p>
                    <div className="mt-6 flex items-center justify-between gap-3">
                      <p className="text-sm text-slate-500">
                        Stock: {book.stock}
                      </p>
                      <Link
                        href={`/books/${book.id}`}
                        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
