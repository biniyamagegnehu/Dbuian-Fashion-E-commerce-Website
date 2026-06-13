import { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Filter, Search, Download, Edit, Trash2, X, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { reviewsAPI } from '../../services/api';
import LoadingSpinner from '../../components/admin/UI/LoadingSpinner';

const Reviews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    positive: 0,
    needsAttention: 0
  });

  // ─── Pagination state ────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const LIMIT = 10;
  const [pagination, setPagination] = useState({
    page: 1, limit: LIMIT, total: 0, pages: 0,
    hasNextPage: false, hasPrevPage: false
  });

  // ─── Respond to Review Modal state ───────────────────────────────────────────
  const [respondTarget, setRespondTarget] = useState(null); // the review being replied to
  const [respondText, setRespondText] = useState('');
  const [respondLoading, setRespondLoading] = useState(false);
  const [respondError, setRespondError] = useState(null);
  const [respondSuccess, setRespondSuccess] = useState(false);
  // ─────────────────────────────────────────────────────────────────────────────

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, ratingFilter]);

  // Fetch whenever page or filters change
  useEffect(() => {
    fetchReviews();
  }, [page, debouncedSearch, ratingFilter]);
  // ─────────────────────────────────────────────────────────────────────────────

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: LIMIT,
        search: debouncedSearch || undefined,
        rating: ratingFilter !== 'all' ? ratingFilter : undefined
      };

      const response = await reviewsAPI.getAll(params);
      const resData = response.data;

      // Handle different response structures
      const reviewsData = resData?.data || resData?.reviews || [];
      setReviews(reviewsData);

      if (resData.pagination) {
        setPagination(resData.pagination);
      }
      if (resData.stats) {
        setStats(resData.stats);
      }
    } catch (error) {
      console.error('❌ Error fetching reviews:', error);
      setError(error.response?.data?.message || 'Failed to fetch reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
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

  const openRespondModal = (review) => {
    setRespondTarget(review);
    setRespondText(review.adminResponse || '');
    setRespondError(null);
    setRespondSuccess(false);
  };

  const closeRespondModal = () => {
    setRespondTarget(null);
    setRespondText('');
    setRespondError(null);
    setRespondSuccess(false);
  };

  const handleRespond = async (e) => {
    e.preventDefault();
    if (!respondTarget) return;
    setRespondLoading(true);
    setRespondError(null);
    try {
      const res = await reviewsAPI.respond(respondTarget._id, respondText.trim() || null);
      // Update the review in local state so badge appears immediately
      setReviews(prev =>
        prev.map(r => r._id === respondTarget._id ? { ...r, adminResponse: (res.data?.review?.adminResponse ?? respondText.trim()) || null } : r)
      );
      setRespondSuccess(true);
      setTimeout(closeRespondModal, 1500);
    } catch (err) {
      setRespondError(err.response?.data?.message || 'Failed to save response');
    } finally {
      setRespondLoading(false);
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
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
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
    const csvData = reviews.map(review => [
      review.product?.name || 'N/A',
      review.user?.name || review.userName || 'Anonymous',
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-red-400 text-center">
          <MessageSquare className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Error Loading Reviews</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchReviews}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Reviews Management
          </h1>
          <p className="text-gray-400 mt-2">Monitor and manage customer reviews and ratings</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            onClick={fetchReviews}
            className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-colors flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span>Refresh</span>
          </button>
          <button 
            onClick={exportReviews}
            className="btn-primary flex items-center space-x-2"
            disabled={reviews.length === 0}
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
            Showing {reviews.length} of {pagination.total || reviews.length} reviews
          </span>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="glass-card p-6">
        <div className="overflow-x-auto">
          {reviews.length > 0 ? (
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
                {reviews.map((review) => {
                  const sentiment = getSentiment(review.rating);
                  const productName = review.product?.name || 'Product Not Found';
                  const userName = review.user?.name || review.userName || 'Anonymous';
                  const userInitial = userName.charAt(0).toUpperCase();
                  
                  return (
                    <tr key={review._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {productName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium">{productName}</div>
                            <div className="text-gray-400 text-sm">{userName}</div>
                            {review.user?.email && (
                              <div className="text-gray-500 text-xs">{review.user.email}</div>
                            )}
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
                        <div 
                          className="text-white max-w-xs" 
                          title={review.comment}
                        >
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
                            onClick={() => openRespondModal(review)}
                            className={`p-2 rounded-lg transition-colors ${
                              review.adminResponse
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                            }`}
                            title={review.adminResponse ? 'Edit Response' : 'Respond to Review'}
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
              <h3 className="text-xl font-semibold text-white mb-2">
                {reviews.length === 0 ? "No Reviews Found" : "No Matching Reviews"}
              </h3>
              <p className="text-gray-400 mb-6">
                {pagination.total === 0 
                  ? "No reviews have been submitted yet."
                  : "No reviews match your current filters. Try adjusting your search criteria."
                }
              </p>
              {pagination.total === 0 && (
                <button
                  onClick={fetchReviews}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Check Again
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {pagination.pages > 1 && (
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
            <span className="text-gray-400 text-sm">
              Page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

      {/* ─── Respond to Review Modal ──────────────────────────────────────────── */}
      {respondTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeRespondModal}
          />

          {/* Modal Card */}
          <div className="relative glass-card w-full max-w-lg p-8 space-y-6 z-10">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {respondTarget.adminResponse ? 'Edit Response' : 'Respond to Review'}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  by {respondTarget.user?.name || respondTarget.userName || 'Anonymous'}
                  {' '}on <span className="text-white">{respondTarget.product?.name || 'Unknown Product'}</span>
                </p>
              </div>
              <button
                onClick={closeRespondModal}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Original Review */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {renderStars(respondTarget.rating)}
                </div>
                <span className="text-gray-400 text-sm">({respondTarget.rating}/5)</span>
              </div>
              <p className="text-gray-300 text-sm italic">
                &ldquo;{respondTarget.comment || 'No comment provided'}&rdquo;
              </p>
            </div>

            {/* Success */}
            {respondSuccess && (
              <div className="flex items-center space-x-3 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-green-300 font-medium">Response saved!</span>
              </div>
            )}

            {/* Error */}
            {respondError && (
              <div className="flex items-center space-x-3 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-red-300">{respondError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRespond} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Response
                  <span className="text-gray-500 font-normal ml-2">(leave blank to remove existing response)</span>
                </label>
                <textarea
                  rows={5}
                  value={respondText}
                  onChange={e => setRespondText(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                  placeholder="Write a helpful response to this review..."
                  maxLength={1000}
                />
                <p className="text-right text-gray-500 text-xs mt-1">{respondText.length}/1000</p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeRespondModal}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={respondLoading || respondSuccess}
                  className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  {respondLoading ? (
                    <span>Saving...</span>
                  ) : respondSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{respondTarget.adminResponse ? 'Update Response' : 'Send Response'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Reviews;
