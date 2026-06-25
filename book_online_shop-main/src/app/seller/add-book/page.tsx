"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useFirebaseAuth from "@/lib/useFirebaseAuth";
import { toast } from "react-hot-toast";
import { fetchCategories } from "@/lib/categories";

type Category = {
  id: string;
  name: string;
  description: string;
};

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  isbn: z.string().optional(),
  pages: z.coerce.number().min(1).optional().or(z.literal("")),
  publishedYear: z.coerce.number().optional().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  stock: z.coerce.number().min(0, "Stock must be 0 or greater"),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

type BookFormValues = z.infer<typeof bookSchema>;

export default function AddBookPage() {
  const { userRole, user, isLoaded } = useFirebaseAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      stock: 0,
    },
  });

  useEffect(() => {
    if (isLoaded && userRole === "admin") {
      router.push("/");
    }
  }, [isLoaded, userRole, router]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    loadCategories();
  }, []);

  const onSubmit = async (data: BookFormValues) => {
    if (!user) return;

    try {
      setIsLoading(true);

      const bookData = {
        title: data.title,
        author: data.author,
        description: data.description,
        price: data.price,
        isbn: data.isbn || "",
        pages: data.pages || 0,
        publishedYear: data.publishedYear || new Date().getFullYear(),
        category: data.category,
        stock: data.stock,
        imageUrl: data.imageUrl || "",
        sellerId: user.uid,
        sellerName: user.displayName || "Unknown Seller",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "books"), bookData);
      toast.success("Book added successfully!");
      router.push("/seller/my-books");
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error("Failed to add book. Please try again.");
    } finally {
      setIsLoading(false);
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
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
          <h1 className="text-3xl font-semibold">Add New Book</h1>
          <p className="mt-2 text-slate-600">
            Create a new book listing for your store.
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Title *
              </label>
              <input
                type="text"
                {...register("title")}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                placeholder="Book title"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Author *
              </label>
              <input
                type="text"
                {...register("author")}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                placeholder="Author name"
              />
              {errors.author && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.author.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Description *
              </label>
              <textarea
                {...register("description")}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                placeholder="Book description"
                rows={4}
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("price")}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Stock *
                </label>
                <input
                  type="number"
                  {...register("stock")}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  placeholder="0"
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
                Category *
              </label>
              <select
                {...register("category")}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  ISBN
                </label>
                <input
                  type="text"
                  {...register("isbn")}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  placeholder="ISBN"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Published Year
                </label>
                <input
                  type="number"
                  {...register("publishedYear")}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  placeholder={new Date().getFullYear().toString()}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Pages
              </label>
              <input
                type="number"
                {...register("pages")}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                placeholder="Number of pages"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Image URL
              </label>
              <input
                type="url"
                {...register("imageUrl")}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                placeholder="https://example.com/book-cover.jpg"
              />
              {errors.imageUrl && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Adding book..." : "Add Book"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
