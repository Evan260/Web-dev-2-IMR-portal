/**
 * MovieForm Component
 * 
 * This component provides a form for adding or editing movie information.
 * It handles form validation and submission.
 */
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/router';

const MovieForm = ({ movie = null }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [actorInput, setActorInput] = useState('');
  const [actorsList, setActorsList] = useState(movie?.actors || []);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: movie?.title || '',
      releaseYear: movie?.releaseYear || new Date().getFullYear(),
    },
  });
  
  const addActor = () => {
    if (actorInput.trim()) {
      setActorsList([...actorsList, actorInput.trim()]);
      setActorInput('');
    }
  };
  
  const removeActor = (index) => {
    setActorsList(actorsList.filter((_, i) => i !== index));
  };
  
  const onSubmit = async (data) => {
    if (actorsList.length === 0) {
      setError('Please add at least one actor');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    const movieData = {
      ...data,
      actors: actorsList,
    };
    
    try {
      const url = movie ? `/api/movies/${movie.id}` : '/api/movies';
      const method = movie ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(movieData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      
      router.push('/movies');
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          type="text"
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            errors.title ? 'border-red-500' : ''
          }`}
          placeholder="Movie title"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <p className="text-red-500 text-xs italic">{errors.title.message}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="releaseYear">
          Release Year
        </label>
        <input
          id="releaseYear"
          type="number"
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            errors.releaseYear ? 'border-red-500' : ''
          }`}
          min="1900"
          max={new Date().getFullYear() + 5}
          {...register('releaseYear', {
            required: 'Release year is required',
            min: {
              value: 1900,
              message: 'Release year must be 1900 or later',
            },
            max: {
              value: new Date().getFullYear() + 5,
              message: `Release year cannot be more than ${new Date().getFullYear() + 5}`,
            },
            valueAsNumber: true,
          })}
        />
        {errors.releaseYear && (
          <p className="text-red-500 text-xs italic">{errors.releaseYear.message}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Actors
        </label>
        <div className="flex">
          <input
            type="text"
            className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Add actor name"
            value={actorInput}
            onChange={(e) => setActorInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addActor();
              }
            }}
          />
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
            onClick={addActor}
          >
            Add
          </button>
        </div>
        {actorsList.length === 0 && (
          <p className="text-red-500 text-xs italic">Please add at least one actor</p>
        )}
        <div className="mt-2">
          {actorsList.map((actor, index) => (
            <div key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              {actor}
              <button
                type="button"
                className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                onClick={() => removeActor(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => router.push('/movies')}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : movie ? 'Update Movie' : 'Add Movie'}
        </button>
      </div>
    </form>
  );
};

export default MovieForm;
