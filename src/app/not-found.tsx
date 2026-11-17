import Link from "next/link";
import { Laptop, Home, ShoppingBag, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-[70vh] flex items-center justify-center px-4 py-16 theme-transition">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <Laptop className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl sm:text-5xl font-black text-blue-600 dark:text-blue-400">404</span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Page or Laptop Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            The laptop model or page you are looking for may have been sold out or moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors shadow"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore All Laptops</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
