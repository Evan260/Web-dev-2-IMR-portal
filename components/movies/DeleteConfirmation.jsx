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
      
      // Check if onDeleteSuccess is a function before calling it
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl text-black font-bold mb-4">Delete Movie</h2>
        <p className="mb-6 text-black">
          Are you sure you want to delete &quot;{movieTitle}&quot;? This action cannot be undone.
        </p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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