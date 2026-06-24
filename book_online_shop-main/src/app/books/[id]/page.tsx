import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchBookById } from "@/lib/books";

type BookDetailProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BookDetailPage({ params }: BookDetailProps) {
  const { id } = await params;
  const book = await fetchBookById(id);

  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr]">
          <section className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="relative w-full h-96 bg-slate-100">
              <img
                src={
                  book.imageUrl ||
                  `https://via.placeholder.com/500x600?text=${encodeURIComponent(
                    book.title,
                  )}`
                }
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = `https://via.placeholder.com/500x600?text=${encodeURIComponent(
                    book.title,
                  )}`;
                }}
              />
            </div>
            <div className="p-8">
              <div className="space-y-6">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                  Book details
                </p>
                <h1 className="text-4xl font-semibold text-slate-900">
                  {book.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <span>By {book.author}</span>
                  <span>•</span>
                  <span>Category: {book.categoryId}</span>
                </div>
                <p className="text-lg font-semibold text-slate-900">
                  ${book.price.toFixed(2)}
                </p>
                <p className="text-sm text-slate-500">Stock: {book.stock}</p>
                <p className="mt-6 leading-7 text-slate-600">
                  {book.description}
                </p>
              </div>
            </div>
          </section>

          <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="rounded-3xl bg-slate-50 p-6 text-center">
              <p className="text-sm text-slate-500">Ready to buy?</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">
                ${book.price.toFixed(2)}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Fast checkout and secure orders.
              </p>
            </div>
            <Link
              href="/cart"
              className="block rounded-full bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Add to cart
            </Link>
            <Link
              href="/books"
              className="block rounded-full border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Back to books
            </Link>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
