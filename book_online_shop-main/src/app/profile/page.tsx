import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
          <h1 className="text-3xl font-semibold">My profile</h1>
          <p className="mt-2 text-slate-600">
            Manage your account information and preferences.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                Name
              </p>
              <p className="mt-4 text-xl font-semibold text-slate-900">
                Guest user
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                Email
              </p>
              <p className="mt-4 text-xl font-semibold text-slate-900">
                Not signed in
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
