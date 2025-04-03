/**
 * MovieCard Component
 * 
 * This component displays information about a single movie.
 * It shows the movie title, actors, and release year.
 * For admin users, it also provides edit and delete buttons.
 */
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import DeleteConfirmation from './DeleteConfirmation';

const MovieCard = ({ movie, onDeleteSuccess = () => {} }) => {
  const { data: session } = useSession();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-transform duration-300 hover:scale-105 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{movie.title}</h2>
        <p className="text-gray-600 mb-4">{movie.releaseYear}</p>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Actors:</h3>
        <ul className="list-disc pl-5 mb-4">
          {movie.actors.map((actor, index) => (
            <li key={index} className="text-gray-600">{actor}</li>
          ))}
        </ul>
      </div>

      {isAdmin && (
        <div className="flex justify-between items-center mt-auto pt-4 space-x-4">
          <Link href={`/movies/edit/${movie.id}`}>
            <span className="flex-1 text-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 font-medium cursor-pointer">
              Edit
            </span>
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-28 text-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 font-medium"
          >
            Delete
          </button>
        </div>
      )}

      {showDeleteModal && (
        <DeleteConfirmation
          movieId={movie.id}
          movieTitle={movie.title}
          onClose={() => setShowDeleteModal(false)}
          onDeleteSuccess={onDeleteSuccess}
        />
      )}
    </div>
  );
};

export default MovieCard;
