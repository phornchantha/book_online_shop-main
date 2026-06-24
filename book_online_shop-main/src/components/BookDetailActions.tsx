"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import useFirebaseAuth from "@/lib/useFirebaseAuth";
import { addToCart } from "@/lib/cart";
import type { Book } from "@/lib/books";

export default function BookDetailActions({ book }: { book: Book }) {
  const { user, isLoaded } = useFirebaseAuth();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!isLoaded) {
      toast.error("Authenticating user...");
      return;
    }

    if (!user) {
      toast.error("Please sign in before adding to cart.");
      return;
    }

    setIsAdding(true);
    try {
      await addToCart({
        title: book.title,
        price: book.price,
        quantity: 1,
        userId: user.uid,
        bookId: book.id,
      });
      toast.success("Book added to cart.");
    } catch (error) {
      toast.error("Unable to add book to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className="mt-4 w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isAdding ? "Adding..." : "Add to cart"}
    </button>
  );
}
