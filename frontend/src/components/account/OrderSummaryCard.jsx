import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';

const OrderSummaryCard = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'shipped': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled':
      case 'refunded': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  return (
    <GlassCard className="p-5 hover:border-cyan-400/30 transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-white">Order #{order.orderId}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)} capitalize`}>
              {order.orderStatus}
            </span>
          </div>
          <p className="text-sm text-gray-400 mb-1">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-400 mb-4">
            {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • Payment: <span className="capitalize">{order.paymentInfo?.status || 'pending'}</span>
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-2xl font-bold text-cyan-400 mb-3">{order.totalPrice} Birr</p>
          <Link 
            to={`/account/orders/${order._id}`}
            className="inline-block px-4 py-2 bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-cyan-400 text-sm font-medium rounded-lg transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
      
      {/* Small preview of items */}
      <div className="mt-4 pt-4 border-t border-gray-700/50 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {order.items.slice(0, 4).map((item, index) => (
          <div key={index} className="w-12 h-12 rounded bg-gray-800 flex-shrink-0 border border-gray-700 overflow-hidden relative group">
            <img 
              src={item.image.startsWith('http') || item.image.startsWith('/api') || item.image.startsWith('/upload') ? item.image : `/api/mock-images/${item.image}`} 
              alt={item.name} 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/images/placeholder.jpg' }}
            />
          </div>
        ))}
        {order.items.length > 4 && (
          <div className="w-12 h-12 rounded bg-gray-800/80 flex items-center justify-center flex-shrink-0 border border-gray-700 text-xs text-gray-400 font-medium">
            +{order.items.length - 4}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default OrderSummaryCard;
