import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
          <h1 className="text-3xl font-semibold">My orders</h1>
          <p className="mt-2 text-slate-600">
            See the status of orders you placed or manage orders for your store.
          </p>
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-600">
            No orders yet. Once you place an order, it will appear here.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
