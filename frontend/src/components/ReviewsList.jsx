import { useState, useEffect } from 'react';
import reviewService from '../services/reviewService';
import { FiStar, FiLoader } from 'react-icons/fi';

function ReviewsList({ entityType, entityId, limit = 10 }) {
  // entityType: 'restaurant' or 'driver'
  // entityId: the ID of the restaurant or driver
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [displayCount, setDisplayCount] = useState(limit);

  useEffect(() => {
    fetchReviews();
  }, [entityType, entityId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      let response;
      
      if (entityType === 'restaurant') {
        response = await reviewService.getRestaurantReviews(entityId);
      } else if (entityType === 'driver') {
        response = await reviewService.getDriverReviews(entityId);
      }
      
      setReviews(response || []);
      setError('');
    } catch (err) {
      setError('Failed to load reviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <FiLoader className="text-2xl text-orange-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p>No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  const displayedReviews = reviews.slice(0, displayCount);

  return (
    <div className="space-y-4">
      {displayedReviews.map(review => (
        <div key={review._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{review.title}</h3>
              <p className="text-gray-600 text-sm">
                by {review.customerId?.name || 'Anonymous'}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={16}
                  className={
                    i < review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
          </div>

          <p className="text-gray-700 mb-3">{review.comment}</p>

          <div className="flex justify-between items-center text-gray-500 text-sm">
            <span>
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <span>
              Rating: <span className="font-semibold text-yellow-500">{review.rating}/5</span>
            </span>
          </div>
        </div>
      ))}

      {reviews.length > displayCount && (
        <button
          onClick={() => setDisplayCount(displayCount + limit)}
          className="w-full py-3 text-orange-600 hover:text-orange-700 font-semibold border border-orange-200 rounded-lg transition"
        >
          Load More Reviews
        </button>
      )}
    </div>
  );
}

export default ReviewsList;
