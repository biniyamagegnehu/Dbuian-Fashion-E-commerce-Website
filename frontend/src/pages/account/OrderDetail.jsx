import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersAPI, getImageUrl } from '../../services/api';
import OrderTimeline from '../../components/account/OrderTimeline';
import GlassCard from '../../components/ui/GlassCard';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const response = await ordersAPI.getById(id);
        if (response.data.success) {
          setOrder(response.data.order);
        }
      } catch (err) {
        setError('Failed to load order details or you are not authorized to view this order.');
        console.error('Error fetching order details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <Link to="/account/orders" className="text-cyan-400 hover:underline mb-4 inline-block">
          &larr; Back to Orders
        </Link>
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center text-red-400">
          {error || 'Order not found'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <div>
          <Link to="/account/orders" className="text-gray-400 hover:text-cyan-400 transition-colors mb-2 inline-flex items-center text-sm">
            &larr; Back to Orders
          </Link>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            Order #{order.orderId}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString(undefined, {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit'
            })}
          </p>
        </div>
        
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            order.paymentInfo?.status === 'paid' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            order.paymentInfo?.status === 'failed' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
          }`}>
            Payment: {order.paymentInfo?.status || 'Pending'}
          </span>
        </div>
      </div>

      <GlassCard className="p-6 mb-8 border-cyan-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Order Status</h3>
        <OrderTimeline 
          status={order.orderStatus}
          trackingNumber={order.trackingNumber}
          shippingCarrier={order.shippingCarrier}
          estimatedDeliveryDate={order.estimatedDeliveryDate}
        />
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 py-4 border-b border-gray-700/50 last:border-0 last:pb-0">
                  <div className="w-20 h-20 rounded-lg bg-gray-800 border border-gray-700 overflow-hidden flex-shrink-0">
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/images/placeholder.jpg' }}
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="text-white font-medium">{item.name}</h4>
                      <p className="text-gray-400 text-sm mt-1">
                        {item.size && <span className="mr-3">Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-400 text-sm">Qty: {item.quantity}</span>
                      <span className="text-cyan-400 font-medium">{item.price} Birr</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">{order.itemsPrice} Birr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span className="text-white">{order.shippingPrice} Birr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tax</span>
                <span className="text-white">{order.taxPrice} Birr</span>
              </div>
              <div className="pt-3 border-t border-gray-700 flex justify-between font-semibold text-lg">
                <span className="text-white">Total</span>
                <span className="text-cyan-400">{order.totalPrice} Birr</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Delivery Information</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p className="font-medium text-white mb-2">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
              <p>{order.shippingInfo.phoneNumber}</p>
              <p>Block {order.shippingInfo.blockNumber}</p>
              <p>Room/Dorm {order.shippingInfo.roomDormNumber}</p>
              <p>Debre Berhan University</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-xl">
                💳
              </div>
              <div>
                <p className="text-white font-medium capitalize">{order.paymentInfo?.method || 'cash_on_delivery'}</p>
                {order.paymentInfo?.txRef && (
                  <p className="text-xs text-gray-500 mt-1 truncate max-w-[150px]" title={order.paymentInfo.txRef}>
                    Ref: {order.paymentInfo.txRef}
                  </p>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
