export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/90 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-slate-600 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
        <p>
          © {new Date().getFullYear()} BookShop. Built with Next.js and
          Firebase.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a href="#" className="hover:text-slate-900">
            Terms
          </a>
          <a href="#" className="hover:text-slate-900">
            Privacy
          </a>
          <a href="#" className="hover:text-slate-900">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
