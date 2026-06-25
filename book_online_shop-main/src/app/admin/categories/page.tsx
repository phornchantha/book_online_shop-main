"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useFirebaseAuth from "@/lib/useFirebaseAuth";
import { toast } from "react-hot-toast";
import {
  Category,
  fetchCategories,
  createCategory,
  deleteCategory,
} from "@/lib/categories";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const { userRole, isLoaded } = useFirebaseAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (isLoaded && userRole !== "admin") {
      router.push("/");
    }
  }, [isLoaded, userRole, router]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const list = await fetchCategories();
        setCategories(list);
      } catch (error) {
        toast.error("Unable to load categories.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setIsCreating(true);
      const id = await createCategory(data);
      setCategories((current) => [...current, { id, ...data }]);
      reset();
      toast.success("Category created.");
    } catch (error) {
      toast.error("Unable to create category.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      setCategories((current) =>
        current.filter((category) => category.id !== categoryId),
      );
      toast.success("Category deleted.");
    } catch (error) {
      toast.error("Unable to delete category.");
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

  if (userRole !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Category management</h1>
              <p className="mt-2 text-slate-600">
                Create and delete categories in Firestore.
              </p>
            </div>
            <div className="w-full max-w-md">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Name
                  </label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                    rows={3}
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
                  disabled={isCreating}
                  className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
                >
                  {isCreating ? "Saving..." : "Save category"}
                </button>
              </form>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-semibold">Existing categories</h2>
            <div className="mt-6 space-y-4">
              {isLoading ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
                  Loading categories...
                </div>
              ) : categories.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
                  No categories yet.
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-lg font-semibold text-slate-900">
                        {category.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {category.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(category.id)}
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
      </main>
      <Footer />
    </div>
  );
}
