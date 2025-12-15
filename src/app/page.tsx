import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          BIM760
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl">
          Comprehensive insurance solutions for your peace of mind
        </p>
        <Link
          href="/auth/signin"
          className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-medium"
        >
          Login
        </Link>
      </main>
    </div>
  );
}
