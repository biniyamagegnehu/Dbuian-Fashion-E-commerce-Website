import { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Filter, Search, Download, Edit, Trash2 } from 'lucide-react';
import { reviewsAPI } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Reviews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    positive: 0,
    needsAttention: 0
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    filterReviews();
    calculateStats();
  }, [reviews, searchTerm, ratingFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewsAPI.getAll();
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = reviews;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      const minRating = parseInt(ratingFilter);
      filtered = filtered.filter(review => review.rating >= minRating);
    }

    setFilteredReviews(filtered);
  };

  const calculateStats = () => {
    const total = reviews.length;
    const averageRating = total > 0 
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / total).toFixed(1)
      : 0;
    const positive = reviews.filter(review => review.rating >= 4).length;
    const needsAttention = reviews.filter(review => review.rating <= 2).length;

    setStats({
      total,
      averageRating,
      positive,
      needsAttention
    });
  };

  const deleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      await reviewsAPI.delete(reviewId);
      await fetchReviews(); // Refresh reviews
      alert('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (rating >= 3) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getSentiment = (rating) => {
    if (rating >= 4) return { text: 'Positive', color: 'text-green-400' };
    if (rating >= 3) return { text: 'Neutral', color: 'text-yellow-400' };
    return { text: 'Negative', color: 'text-red-400' };
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-500'}`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatCard = ({ title, value, description, color, icon: Icon }) => (
    <div className="glass-card p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  const RatingFilter = ({ rating, active, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        active 
          ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400' 
          : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
      }`}
    >
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-500'
            }`}
          />
        ))}
      </div>
      <span>& up</span>
    </button>
  );

  const exportReviews = () => {
    // Simple CSV export functionality
    const headers = ['Product', 'Customer', 'Rating', 'Comment', 'Sentiment', 'Date'];
    const csvData = filteredReviews.map(review => [
      review.product?.name || 'N/A',
      review.user?.name || 'N/A',
      review.rating,
      `"${(review.comment || '').replace(/"/g, '""')}"`,
      getSentiment(review.rating).text,
      formatDate(review.createdAt)
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `${field}`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reviews-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading reviews..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Reviews Management
          </h1>
          <p className="text-gray-400 mt-2">Monitor and manage customer reviews and ratings</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={exportReviews}
            className="btn-primary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Reviews</span>
          </button>
        </div>
      </div>

      {/* Review Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Reviews"
          value={stats.total}
          description="All customer reviews"
          color="bg-blue-500/20 border border-blue-500/30"
          icon={MessageSquare}
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating}
          description="Out of 5 stars"
          color="bg-yellow-500/20 border border-yellow-500/30"
          icon={Star}
        />
        <StatCard
          title="Positive"
          value={stats.positive}
          description="4-5 star reviews"
          color="bg-green-500/20 border border-green-500/30"
          icon={ThumbsUp}
        />
        <StatCard
          title="Needs Attention"
          value={stats.needsAttention}
          description="1-2 star reviews"
          color="bg-orange-500/20 border border-orange-500/30"
          icon={ThumbsDown}
        />
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews by product name, customer, or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setRatingFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                ratingFilter === 'all'
                  ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              All Ratings
            </button>
            {[5, 4, 3, 2, 1].map(rating => (
              <RatingFilter
                key={rating}
                rating={rating}
                active={ratingFilter === rating.toString()}
                onClick={() => setRatingFilter(rating.toString())}
              />
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2 mt-4">
          {ratingFilter !== 'all' && (
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
              Rating: {ratingFilter} stars & up
            </span>
          )}
          {searchTerm && (
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
              Search: "{searchTerm}"
            </span>
          )}
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </span>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="glass-card p-6">
        <div className="overflow-x-auto">
          {filteredReviews.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Product & Customer</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Rating</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Comment</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Sentiment</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review) => {
                  const sentiment = getSentiment(review.rating);
                  return (
                    <tr key={review._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {review.product?.name?.charAt(0)?.toUpperCase() || 'P'}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium">{review.product?.name || 'N/A'}</div>
                            <div className="text-gray-400 text-sm">{review.user?.name || 'Anonymous'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-white font-medium">({review.rating})</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-white max-w-xs truncate" title={review.comment}>
                          {review.comment || 'No comment provided'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getRatingColor(review.rating)}`}>
                          <span className="text-sm font-medium">{sentiment.text}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-400 text-sm">
                          {formatDate(review.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => alert(`Respond to review: ${review.comment}`)}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                            title="Respond to Review"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteReview(review._id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            title="Delete Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Reviews Found</h3>
              <p className="text-gray-400 mb-6">
                {reviews.length === 0 
                  ? "No reviews have been submitted yet."
                  : "No reviews match your current filters. Try adjusting your search criteria."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;