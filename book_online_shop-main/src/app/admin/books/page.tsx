"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "react-hot-toast";
import { Book, fetchBooks, createBook, deleteBook } from "@/lib/books";
import { fetchCategories } from "@/lib/categories";
import { bookFormSchema } from "@/lib/bookForm";
import type { BookFormValues } from "@/lib/bookForm";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState(
    [] as { id: string; name: string }[],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      price: 0,
      stock: 0,
      categoryId: "",
      sellerId: "seller-1",
      description: "",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [booksList, categoryList] = await Promise.all([
          fetchBooks(),
          fetchCategories(),
        ]);
        setBooks(booksList);
        setCategories(
          categoryList.map((category) => ({
            id: category.id,
            name: category.name,
          })),
        );
      } catch (error) {
        toast.error("Unable to load admin data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const onSubmit = async (data: BookFormValues) => {
    try {
      setIsSubmitting(true);
      const id = await createBook(data);
      setBooks((current) => [...current, { id, ...data }]);
      reset();
      toast.success("Book created successfully.");
    } catch (error) {
      toast.error("Unable to create book.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (bookId: string) => {
    try {
      await deleteBook(bookId);
      setBooks((current) => current.filter((book) => book.id !== bookId));
      toast.success("Book deleted.");
    } catch (error) {
      toast.error("Unable to delete book.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Book management</h1>
              <p className="mt-2 text-slate-600">
                Add and delete books from the Firestore collection.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Title
                  </label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Author
                  </label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                    {...register("author")}
                  />
                  {errors.author && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.author.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                      {...register("price", { valueAsNumber: true })}
                    />
                    {errors.price && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.price.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Stock
                    </label>
                    <input
                      type="number"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                      {...register("stock", { valueAsNumber: true })}
                    />
                    {errors.stock && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.stock.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Category
                  </label>
                  <select
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                    {...register("categoryId")}
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Seller
                  </label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                    {...register("sellerId")}
                  />
                  {errors.sellerId && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.sellerId.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
                >
                  {isSubmitting ? "Adding book..." : "Add book"}
                </button>
              </form>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold">Existing books</h2>
              <div className="mt-6 space-y-4">
                {isLoading ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">
                    Loading books...
                  </div>
                ) : books.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">
                    No books yet.
                  </div>
                ) : (
                  books.map((book) => (
                    <div
                      key={book.id}
                      className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          {book.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {book.author}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  ))
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
