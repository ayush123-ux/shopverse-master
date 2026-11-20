import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-5xl font-bold text-[#d4a373]">404</h1>
      <p className="text-xl text-gray-400">Page not found</p>
      <p className="text-gray-500 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#8b5e3c] to-[#d4a373] text-black hover:opacity-90 transition shadow-lg"
      >
        Go Home
      </Link>
    </div>
  );
}
