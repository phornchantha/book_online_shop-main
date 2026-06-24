"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useFirebaseAuth from "@/lib/useFirebaseAuth";
import {
  fetchCartItems,
  updateCartItem,
  removeCartItem,
  CartItem,
} from "@/lib/cart";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function CartPage() {
  const { user, isLoaded } = useFirebaseAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const loadCart = async () => {
      try {
        const items = await fetchCartItems(user.uid);
        setCartItems(items);
      } catch (error) {
        toast.error("Unable to load cart items.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [isLoaded, user]);

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  const changeQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateCartItem(itemId, quantity);
      setCartItems((current) =>
        current.map((item) =>
          item.id === itemId ? { ...item, quantity } : item,
        ),
      );
    } catch (error) {
      toast.error("Failed to update quantity.");
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await removeCartItem(itemId);
      setCartItems((current) => current.filter((item) => item.id !== itemId));
    } catch (error) {
      toast.error("Failed to remove item.");
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          Loading cart...
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold">Shopping cart</h1>
        <p className="mt-2 text-sm text-slate-600">
          Review your selected books and proceed to checkout.
        </p>

        <section className="mt-8 space-y-6">
          {isLoading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
              Loading items...
            </div>
          ) : cartItems.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
              Your cart is empty.{" "}
              <Link
                href="/books"
                className="font-semibold text-slate-900 hover:text-slate-700"
              >
                Browse books
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                          {item.title}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            changeQuantity(item.id, item.quantity - 1)
                          }
                          className="rounded-full border border-slate-200 px-3 py-1 text-sm"
                        >
                          -
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            changeQuantity(item.id, item.quantity + 1)
                          }
                          className="rounded-full border border-slate-200 px-3 py-1 text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4 text-sm text-slate-500">
                      <span>
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Order summary</h2>
                <div className="mt-6 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between text-xl font-semibold text-slate-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Link
                  href="/checkout"
                  className="mt-6 block rounded-full bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Continue to checkout
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
