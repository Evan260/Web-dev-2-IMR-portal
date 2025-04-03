/**
 * Movies List Page
 *
 * This page displays a list of all movies in the database.
 * It fetches movie data from the API and renders the MovieList component.
 */
import Head from "next/head";
import { useState } from "react";
import MovieList from "../../components/movies/MovieList";
import { useSession } from "next-auth/react";
import Link from "next/link";
import prisma from "../../lib/prisma";

export default function Movies({ movies: initialMovies }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState(initialMovies);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const handleMovieDelete = (deletedMovieId) => {
    setMovies((prevMovies) =>
      prevMovies.filter((movie) => movie.id !== deletedMovieId)
    );
  };

  const filteredMovies =
    searchTerm.trim() === ""
      ? movies
      : movies.filter((movie) => {
          const term = searchTerm.toLowerCase();
          return (
            movie.title.toLowerCase().includes(term) ||
            (movie.actors &&
              movie.actors.some((actor) =>
                actor.toLowerCase().includes(term)
              )) ||
            movie.releaseYear.toString().includes(term)
          );
        });

  return (
    <>
      <Head>
        <title>Movies Collection</title>
        <meta name="description" content="Browse our movie collection" />
      </Head>
      <div className="py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Movies Collection</h1>
          <p className="text-gray-300 max-w-xl mx-auto text-lg">
            Browse, search, and manage your favorite movies.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4 md:mb-0">Browse All Titles</h2>
            {isAdmin && (
              <Link href="/movies/add">
                <span className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transform transition duration-300 hover:scale-105 cursor-pointer font-medium">
                  + Add New Movie
                </span>
              </Link>
            )}
          </div>

          <div className="mb-8">
            <input
              type="text"
              placeholder="Search movies by title, actor, or year..."
              className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredMovies.length > 0 ? (
            <MovieList
              movies={filteredMovies}
              onDeleteMovie={handleMovieDelete}
            />
          ) : (
            <div className="text-center py-10 bg-gray-800 text-white rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-2">No movies found</h2>
              <p className="text-gray-300">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: { title: "asc" },
    });
    return {
      props: {
        movies: JSON.parse(JSON.stringify(movies)),
      },
    };
  } catch (error) {
    console.error("Error fetching movies:", error);
    return {
      props: {
        movies: [],
      },
    };
  }
}
