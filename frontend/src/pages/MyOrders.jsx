import { useEffect, useState } from "react";
import { Package, Truck } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { ordersAPI } from "../services/api";

const statuses = ["pending", "processing", "shipped", "delivered"];

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await ordersAPI.getUserOrders();
        setOrders(response.data?.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load your orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">My Orders</h1>

        {error && <p className="text-red-300 mb-4">{error}</p>}

        <div className="space-y-5">
          {orders.map((order) => {
            const currentIndex = statuses.indexOf(order.orderStatus);

            return (
              <GlassCard key={order._id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Order ID</p>
                    <p className="text-white font-mono">{order.orderId}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Payment</p>
                    <p className="text-cyan-300 capitalize">
                      {order.paymentInfo?.method?.replaceAll("_", " ")} - {order.paymentInfo?.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total</p>
                    <p className="text-white font-semibold">ETB {order.totalPrice?.toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 my-6">
                  {statuses.map((status, index) => (
                    <div key={status} className="text-center">
                      <div
                        className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                          index <= currentIndex ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-400"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <p className="text-xs text-gray-300 mt-2 capitalize">{status}</p>
                    </div>
                  ))}
                </div>

                {(order.trackingNumber || order.shippingCarrier || order.estimatedDeliveryDate) && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold flex items-center mb-3">
                      <Truck className="w-4 h-4 mr-2 text-cyan-400" />
                      Tracking
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <p className="text-gray-300">Carrier: {order.shippingCarrier || "Not assigned"}</p>
                      <p className="text-gray-300">Tracking: {order.trackingNumber || "Not assigned"}</p>
                      <p className="text-gray-300">
                        ETA: {order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toLocaleDateString() : "Not set"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-4 text-sm text-gray-400 flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  {order.items?.length || 0} item(s)
                </div>
              </GlassCard>
            );
          })}

          {orders.length === 0 && !error && (
            <GlassCard className="p-8 text-center text-gray-300">
              You have not placed any orders yet.
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
