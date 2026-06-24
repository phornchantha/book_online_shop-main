"use client";

import Link from "next/link";
import { Book } from "@/lib/books";

type BookCardProps = {
  book: Book;
  size?: "sm" | "lg";
};

export default function BookCard({ book, size = "sm" }: BookCardProps) {
  const imageHeight = size === "sm" ? "h-56" : "h-80";

  return (
    <article className="rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md overflow-hidden">
      {book.imageUrl && (
        <div className={`relative w-full ${imageHeight} bg-slate-100`}>
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = `https://via.placeholder.com/300x400?text=${encodeURIComponent(book.title)}`;
            }}
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900 line-clamp-2">
              {book.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{book.author}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 whitespace-nowrap">
            ${book.price.toFixed(2)}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-2">
          {book.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
          </p>
          <Link
            href={`/books/${book.id}`}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
