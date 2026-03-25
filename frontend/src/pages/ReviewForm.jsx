import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import reviewService from '../services/reviewService';
import { FiArrowLeft, FiLoader, FiStar } from 'react-icons/fi';

function ReviewForm() {
  const navigate = useNavigate();
  const { type, id } = useParams(); // type: 'restaurant' or 'driver', id: entity id
  const { isAuthenticated } = useSelector(state => state.auth);

  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !title.trim() || !comment.trim()) {
      setError('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const reviewData = {
        rating,
        title,
        comment,
        [type === 'restaurant' ? 'restaurantId' : 'driverId']: id
      };

      if (type === 'restaurant') {
        await reviewService.createRestaurantReview(id, reviewData);
      } else if (type === 'driver') {
        await reviewService.createDriverReview(id, reviewData);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate(`/${type === 'restaurant' ? 'restaurant' : 'driver'}/${id}`);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-8"
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Write a Review
          </h1>
          <p className="text-gray-600 mb-8">
            Share your experience with this {type === 'restaurant' ? 'restaurant' : 'driver'}
          </p>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              ✓ Review submitted successfully! Redirecting...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-gray-800 font-semibold mb-3">
                Rating (out of 5 stars)
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none transition"
                    >
                      <FiStar
                        size={40}
                        className={`${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        } transition cursor-pointer`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-gray-800 font-semibold">
                  {hoveredRating || rating} stars
                </p>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Review Title
              </label>
              <input
                type="text"
                placeholder="e.g., 'Excellent food and service' or 'Fastest delivery ever!'"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-600"
                required
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Your Review
              </label>
              <textarea
                placeholder="Share your experience. What was good? What could be improved?"
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-600"
                rows="6"
                required
              />
              <p className="text-gray-500 text-sm mt-2">
                {comment.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <FiLoader className="animate-spin" />}
              <span>{loading ? 'Submitting...' : 'Submit Review'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReviewForm;
