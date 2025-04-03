/**
 * Home Page
 *
 * This is the landing page of the application.
 * It displays a welcome message and links to other pages.
 */
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>IMR - Internet Movies Rental</title>
        <meta name="description" content="Internet Movies Rental Company portal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="py-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">Welcome to IMR Portal</h1>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Your one-stop destination for movie rentals and management. Explore our collection, or manage the database with secure tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105">
            <h2 className="text-2xl font-bold mb-4">Browse Movies</h2>
            <p className="mb-6">
              Explore our extensive collection of movies. Find information about titles, actors, and release years.
            </p>
            <Link href="/movies">
              <span className="inline-block bg-white text-gray-800 px-6 py-3 rounded-md hover:bg-gray-200 cursor-pointer font-medium transition duration-200">
                View Movies
              </span>
            </Link>
          </div>

          {session ? (
            <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105">
              <h2 className="text-2xl font-bold mb-4">Welcome Back, {session.user.name}!</h2>
              <p className="mb-6">
                {session.user.role === "ADMIN"
                  ? "As an admin, you can manage the movie database, add new movies, and update existing ones."
                  : "Enjoy browsing our movie collection and discovering new titles."}
              </p>
              {session.user.role === "ADMIN" && (
                <Link href="/movies/add">
                  <span className="inline-block bg-white text-gray-800 px-6 py-3 rounded-md hover:bg-gray-200 cursor-pointer font-medium transition duration-200">
                    Add New Movie
                  </span>
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105">
              <h2 className="text-2xl font-bold mb-4">Join Us</h2>
              <p className="mb-6">
                Sign in to your account or create a new one to get the full IMR experience.
              </p>
              <div className="flex space-x-4">
                <Link href="/login">
                  <span className="inline-block bg-white text-gray-800 px-6 py-3 rounded-md hover:bg-gray-200 cursor-pointer font-medium transition duration-200">
                    Sign In
                  </span>
                </Link>
                <Link href="/signup">
                  <span className="inline-block bg-white text-gray-800 px-6 py-3 rounded-md hover:bg-gray-200 cursor-pointer font-medium transition duration-200">
                    Sign Up
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white text-black mt-16 py-14 px-8 rounded-2xl shadow-xl max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Why Choose IMR?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">Freedom!</h3>
              <p className="text-gray-700">Easily add, edit, and delete movies from the database</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Cool-Looking</h3>
              <p className="text-gray-700">
                A user-friendly futuristic interface built with Next.js and Tailwind CSS
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
              <p className="text-gray-700">
                Access using NextAuth to protect your data and control access
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 py-16 px-6 bg-gray-800 rounded-2xl shadow-xl text-white text-center max-w-5xl mx-auto transform transition duration-300 hover:scale-105">
          <h2 className="text-3xl font-bold mb-4">Ready to Dive In?</h2>
          <p className="text-lg mb-6">
            Sign up or log in to start browsing and renting your favorite movies!
          </p>
          <Link href="/signup">
            <span className="inline-block bg-white text-gray-800 px-6 py-3 rounded-md hover:bg-gray-200 cursor-pointer font-medium transition duration-200">
              Get Started
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
