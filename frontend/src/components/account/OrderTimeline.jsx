import React from 'react';

const OrderTimeline = ({ status, trackingNumber, shippingCarrier, estimatedDeliveryDate }) => {
  const isCancelled = status === 'cancelled' || status === 'refunded';
  
  const steps = [
    { id: 'pending', label: 'Order Placed', icon: '📝' },
    { id: 'processing', label: 'Processing', icon: '⚙️' },
    { id: 'shipped', label: 'Shipped', icon: '🚚' },
    { id: 'delivered', label: 'Delivered', icon: '📦' }
  ];

  const getStepStatus = (stepId) => {
    if (isCancelled) return stepId === 'pending' ? 'completed' : 'cancelled';
    
    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    const stepIndex = statusOrder.indexOf(stepId);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="py-6">
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-700 rounded-full" />
        
        {/* Active Progress Bar */}
        {!isCancelled && (
          <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
            style={{ 
              width: status === 'pending' ? '0%' : 
                     status === 'processing' ? '33%' : 
                     status === 'shipped' ? '66%' : '100%' 
            }}
          />
        )}

        <div className="relative flex justify-between items-center z-10">
          {steps.map((step) => {
            const stepStatus = getStepStatus(step.id);
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg border-2 transition-all duration-300 ${
                    stepStatus === 'completed' ? 'bg-cyan-500 border-cyan-400 text-white shadow-cyan-500/50' :
                    stepStatus === 'current' ? 'bg-gray-800 border-cyan-400 text-white ring-4 ring-cyan-500/20' :
                    stepStatus === 'cancelled' ? 'bg-gray-800 border-red-500 text-red-500 opacity-50' :
                    'bg-gray-800 border-gray-600 text-gray-500'
                  }`}
                >
                  {step.icon}
                </div>
                <span className={`mt-2 text-xs font-medium ${
                  stepStatus === 'completed' || stepStatus === 'current' ? 'text-cyan-400' :
                  stepStatus === 'cancelled' ? 'text-red-500' :
                  'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {isCancelled && (
        <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
          <p className="text-red-400 font-medium">This order has been {status}.</p>
        </div>
      )}

      {(trackingNumber || estimatedDeliveryDate) && !isCancelled && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(trackingNumber || shippingCarrier) && (
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Tracking Info</h4>
              <p className="text-white font-medium">
                {shippingCarrier && <span className="text-cyan-400 mr-2">{shippingCarrier}</span>}
                {trackingNumber}
              </p>
            </div>
          )}
          
          {estimatedDeliveryDate && (
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Estimated Delivery</h4>
              <p className="text-white font-medium">
                {new Date(estimatedDeliveryDate).toLocaleDateString(undefined, {
                  weekday: 'short', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;
