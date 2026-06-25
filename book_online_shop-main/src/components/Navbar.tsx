"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useFirebaseAuth from "@/lib/useFirebaseAuth";
import { logoutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const userNavItems = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Books" },
  { href: "/seller", label: "Dashboard" },
  { href: "/seller/my-books", label: "My Books" },
  { href: "/seller/add-book", label: "Add Book" },
  { href: "/cart", label: "Cart" },
  { href: "/orders", label: "Orders" },
  { href: "/profile", label: "Profile" },
];

const adminNavItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/books", label: "Books" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userRole, isLoaded } = useFirebaseAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  let navItems = userNavItems;
  if (userRole === "admin") {
    navItems = adminNavItems;
  }

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold text-slate-900">
          📚 Foho Books
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                pathname === item.href
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {!isLoaded ? (
            <div className="text-sm text-slate-600">Loading...</div>
          ) : user ? (
            <>
              <span className="hidden sm:inline text-sm font-medium text-slate-700">
                {userRole === "admin" && "👨‍💼 Admin"}
                {userRole === "user" && "👤 User"}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
