import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import { paymentsAPI } from "../services/api";
import { useCart } from "../context/CartContext";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { clearCart } = useCart();
  const [state, setState] = useState({
    loading: true,
    success: false,
    message: "Verifying your payment...",
    order: null,
  });

  useEffect(() => {
    const verify = async () => {
      const txRef = searchParams.get("tx_ref");

      if (!txRef) {
        setState({
          loading: false,
          success: false,
          message: "Payment reference is missing.",
          order: null,
        });
        return;
      }

      try {
        const response = await paymentsAPI.verifyChapa(txRef);
        const isPaid = response.data?.status === "paid";

        if (isPaid) {
          await clearCart();
        }

        setState({
          loading: false,
          success: isPaid,
          message: isPaid
            ? "Payment confirmed. Your order is now being processed."
            : "Payment was not completed. Please try again or contact support.",
          order: response.data?.order,
        });
      } catch (error) {
        setState({
          loading: false,
          success: false,
          message:
            error.response?.data?.message ||
            "Could not verify payment. Please contact support if money was deducted.",
          order: null,
        });
      }
    };

    verify();
  }, [clearCart, location.state, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-12">
        <GlassCard className="max-w-xl mx-auto p-8 text-center">
          {state.loading ? (
            <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
          ) : state.success ? (
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          )}

          <h1 className="text-2xl font-bold text-white mb-3">
            {state.loading
              ? "Verifying Payment"
              : state.success
                ? "Payment Successful"
                : "Payment Not Confirmed"}
          </h1>
          <p className="text-gray-300 mb-6">{state.message}</p>

          {state.order && (
            <div className="bg-white/5 rounded-lg p-4 mb-6 text-left">
              <p className="text-gray-400 text-sm">Order ID</p>
              <p className="text-white font-mono">{state.order.orderId}</p>
              <p className="text-gray-400 text-sm mt-3">Status</p>
              <p className="text-cyan-300 capitalize">{state.order.orderStatus}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/my-orders"
              className="px-5 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              View My Orders
            </Link>
            <Link
              to="/products"
              className="px-5 py-3 bg-white/10 text-gray-200 rounded-lg hover:bg-white/20 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default PaymentResult;
