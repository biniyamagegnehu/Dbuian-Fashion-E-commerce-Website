import { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Filter, Search } from 'lucide-react';

const Reviews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

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
          <button className="btn-primary flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Export Reviews</span>
          </button>
        </div>
      </div>

      {/* Review Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Reviews"
          value="2,847"
          description="All customer reviews"
          color="bg-blue-500/20 border border-blue-500/30"
          icon={MessageSquare}
        />
        <StatCard
          title="Average Rating"
          value="4.7"
          description="Out of 5 stars"
          color="bg-yellow-500/20 border border-yellow-500/30"
          icon={Star}
        />
        <StatCard
          title="Positive"
          value="2,541"
          description="4-5 star reviews"
          color="bg-green-500/20 border border-green-500/30"
          icon={ThumbsUp}
        />
        <StatCard
          title="Needs Attention"
          value="23"
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
      </div>

      {/* Reviews Content */}
      <div className="glass-card p-8">
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Review Management System</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Our comprehensive review management system is under development. You'll be able to moderate reviews, 
            respond to customer feedback, analyze sentiment, and improve product quality based on customer insights.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Sentiment Analysis</h4>
              <p className="text-gray-400 text-sm">AI-powered review sentiment detection</p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Response Management</h4>
              <p className="text-gray-400 text-sm">Quickly respond to customer feedback</p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Rating Analytics</h4>
              <p className="text-gray-400 text-sm">Detailed rating trends and insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;