/**
 * DeleteConfirmation Component
 * 
 * This component displays a confirmation modal before deleting a movie.
 * It handles the delete operation and provides feedback on the result.
 */
import { useState } from 'react';

const DeleteConfirmation = ({ movieId, movieTitle, onClose = () => {}, onDeleteSuccess = () => {} }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/movies/${movieId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete movie');
      }

      if (typeof onDeleteSuccess === 'function') {
        onDeleteSuccess(movieId);
      }

      onClose();
    } catch (err) {
      setError(err.message);
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Delete Movie</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete <span className="font-semibold">&quot;{movieTitle}&quot;</span>? This action cannot be undone.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-200"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition duration-200"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
