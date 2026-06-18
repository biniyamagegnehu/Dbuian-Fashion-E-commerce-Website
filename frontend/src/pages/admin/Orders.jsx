import { useState, useEffect } from 'react';
import { getImageUrl } from '../../services/api';
import { ordersAPI } from '../../services/api';
import LoadingSpinner from '../../components/admin/UI/LoadingSpinner';
import { 
  ShoppingCart, 
  Filter, 
  Clock, 
  CheckCircle, 
  Truck, 
  Package, 
  Search, 
  Download,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Timer
} from 'lucide-react';


const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [trackingForms, setTrackingForms] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    urgent: 0
  });

  // ─── Pagination state ────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const LIMIT = 10;
  const [pagination, setPagination] = useState({
    page: 1, limit: LIMIT, total: 0, pages: 0,
    hasNextPage: false, hasPrevPage: false
  });

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);

  // Fetch whenever page or filters change
  useEffect(() => {
    fetchOrders();
  }, [page, debouncedSearch, statusFilter]);
  // ─────────────────────────────────────────────────────────────────────────────

  const statusOptions = [
    { value: 'all', label: 'All Orders', icon: Package, color: 'gray' },
    { value: 'pending', label: 'Pending', icon: Clock, color: 'orange' },
    { value: 'processing', label: 'Processing', icon: Package, color: 'blue' },
    { value: 'shipped', label: 'Shipped', icon: Truck, color: 'purple' },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'green' }
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: LIMIT,
        search: debouncedSearch || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      };
      const response = await ordersAPI.getAll(params);
      const resData = response.data;
      setOrders(resData.data || resData.orders || []);
      
      if (resData.pagination) {
        setPagination(resData.pagination);
      }
      if (resData.stats) {
        setStats(resData.stats);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const isOrderUrgent = (createdAt) => {
    const orderTime = new Date(createdAt);
    const now = new Date();
    const hoursSinceOrder = (now - orderTime) / (1000 * 60 * 60);
    return hoursSinceOrder >= 2; // Urgent if pending for 2+ hours
  };

  const getTimeRemaining = (createdAt) => {
    const orderTime = new Date(createdAt);
    const deliveryDeadline = new Date(orderTime.getTime() + 3 * 60 * 60 * 1000); // 3 hours from order time
    const now = new Date();
    const timeRemaining = deliveryDeadline - now;

    if (timeRemaining <= 0) {
      return { overdue: true, text: 'OVERDUE', color: 'text-red-400' };
    }

    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return { 
        overdue: false, 
        text: `${hours}h ${minutes}m`, 
        color: hours < 1 ? 'text-orange-400' : 'text-green-400' 
      };
    } else {
      return { 
        overdue: false, 
        text: `${minutes}m`, 
        color: 'text-orange-400' 
      };
    }
  };

  const getDeliveryProgress = (order) => {
    const orderTime = new Date(order.createdAt);
    const now = new Date();
    const timePassed = now - orderTime;
    const totalTime = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    const progress = Math.min((timePassed / totalTime) * 100, 100);

    if (order.orderStatus === 'delivered') return 100;
    if (order.orderStatus === 'shipped') return 80;
    if (order.orderStatus === 'processing') return 40;
    return progress;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      await fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const handleTrackingChange = (orderId, field, value) => {
    setTrackingForms((prev) => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || {}),
        [field]: value
      }
    }));
  };

  const saveTrackingInfo = async (order) => {
    try {
      const draft = trackingForms[order._id] || {};
      await ordersAPI.updateStatus(order._id, {
        status: draft.status || order.orderStatus,
        trackingNumber: draft.trackingNumber ?? order.trackingNumber,
        shippingCarrier: draft.shippingCarrier ?? order.shippingCarrier,
        estimatedDeliveryDate: draft.estimatedDeliveryDate ?? order.estimatedDeliveryDate,
        adminNotes: draft.adminNotes ?? order.adminNotes,
        note: draft.note || 'Tracking information updated'
      });
      await fetchOrders();
      setTrackingForms((prev) => ({ ...prev, [order._id]: {} }));
    } catch (error) {
      console.error('Error saving tracking info:', error);
      alert('Failed to save tracking information');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'shipped': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return Clock;
      case 'processing': return Package;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      default: return Package;
    }
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

  const formatPrice = (price) => {
    return `ETB ${price?.toFixed(2) || '0.00'}`;
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const StatCard = ({ title, value, color, icon: Icon, description }) => (
    <div className="glass-card p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          {description && <p className="text-gray-400 text-sm">{description}</p>}
        </div>
        <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  const OrderDetailsCard = ({ order }) => {
    const timeRemaining = getTimeRemaining(order.createdAt);
    const deliveryProgress = getDeliveryProgress(order);
    const isUrgent = isOrderUrgent(order.createdAt);
    const trackingDraft = trackingForms[order._id] || {};

    return (
      <div className="mt-4 bg-gray-800/30 rounded-lg border border-gray-700/50 p-6">
        {/* Delivery Timeline */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Timer className="w-5 h-5 mr-2 text-cyan-400" />
              Delivery Timeline
            </h3>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
              timeRemaining.overdue 
                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            }`}>
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{timeRemaining.text}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                timeRemaining.overdue ? 'bg-red-500' :
                deliveryProgress >= 80 ? 'bg-green-500' :
                deliveryProgress >= 50 ? 'bg-yellow-500' : 'bg-cyan-500'
              }`}
              style={{ width: `${deliveryProgress}%` }}
            ></div>
          </div>

          {/* Timeline Steps */}
          <div className="grid grid-cols-4 gap-4 text-center">
            {[
              { status: 'pending', label: 'Order Placed', time: 'Now' },
              { status: 'processing', label: 'Processing', time: '+30 min' },
              { status: 'shipped', label: 'On the Way', time: '+1 hour' },
              { status: 'delivered', label: 'Delivered', time: '+3 hours' }
            ].map((step, index) => (
              <div key={step.status} className="text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  order.orderStatus === step.status 
                    ? 'bg-cyan-500 text-white' 
                    : index < ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.orderStatus)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {index + 1}
                </div>
                <div className="text-white text-sm font-medium">{step.label}</div>
                <div className="text-gray-400 text-xs">{step.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <User className="w-5 h-5 mr-2 text-cyan-400" />
              Customer Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-white font-medium">
                  {order.user?.name || `${order.shippingInfo?.firstName} ${order.shippingInfo?.lastName}`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-white font-medium">{order.user?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Phone:</span>
                <span className="text-white font-medium flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {order.shippingInfo?.phoneNumber || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-green-400" />
              Delivery Address
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Block:</span>
                <span className="text-white font-medium">{order.shippingInfo?.blockNumber || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Room/Dorm:</span>
                <span className="text-white font-medium">{order.shippingInfo?.roomDormNumber || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Campus:</span>
                <span className="text-white font-medium">Debre Berhan University</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
<div className="lg:col-span-2 space-y-4">
  <h3 className="text-lg font-semibold text-white flex items-center">
    <Package className="w-5 h-5 mr-2 text-yellow-400" />
    Order Items ({order.items?.length || 0})
  </h3>
  <div className="space-y-3">
    {order.items?.map((item, index) => {
      // Get the first image from the images array or fallback to item.image
      const itemImage = item.images && item.images.length > 0 
        ? getImageUrl(
            typeof item.images[0] === 'string' 
              ? item.images[0] 
              : item.images[0].url
          )
        : item.image || '/images/default-product.jpg';

      return (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={itemImage}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-lg"
                onError={(e) => {
                  console.error('Order item image failed to load:', itemImage);
                  e.target.style.display = 'none';
                  // Show fallback
                  const fallback = document.createElement('div');
                  fallback.className = 'w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center';
                  fallback.innerHTML = '<Package className="w-6 h-6 text-gray-500" />';
                  e.target.parentNode.appendChild(fallback);
                }}
              />
              {/* Fallback that shows if image fails */}
              <div className="hidden w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center absolute inset-0">
                <Package className="w-6 h-6 text-gray-500" />
              </div>
            </div>
            <div>
              <div className="text-white font-medium">{item.name}</div>
              <div className="text-gray-400 text-sm">
                Size: {item.size} • Qty: {item.quantity}
                {item.color && ` • Color: ${item.color}`}
              </div>
            </div>
          </div>
          <div className="text-cyan-400 font-semibold">
            {formatPrice(item.price * item.quantity)}
          </div>
        </div>
      );
    })}
  </div>
</div>
          {/* Payment & Order Summary */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-purple-400" />
              Payment & Order Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                <div className="text-gray-400 text-sm">Items Total</div>
                <div className="text-white font-semibold">{formatPrice(order.itemsPrice)}</div>
              </div>
              <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                <div className="text-gray-400 text-sm">Tax (15%)</div>
                <div className="text-white font-semibold">{formatPrice(order.taxPrice)}</div>
              </div>
              <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                <div className="text-gray-400 text-sm">Shipping</div>
                <div className="text-white font-semibold">{formatPrice(order.shippingPrice)}</div>
              </div>
              <div className="text-center p-3 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                <div className="text-cyan-400 text-sm">Total Amount</div>
                <div className="text-cyan-300 font-bold text-lg">{formatPrice(order.totalPrice)}</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-gray-400">Payment Method:</span>
              </div>
              <span className="text-white font-medium capitalize">
                {order.paymentInfo?.method?.replace('_', ' ') || 'Cash on Delivery'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-gray-400">Order Date:</span>
              </div>
              <span className="text-white font-medium">{formatDate(order.createdAt)}</span>
            </div>
            {order.deliveredAt && (
              <div className="flex items-center justify-between p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  <span className="text-green-400">Delivered On:</span>
                </div>
                <span className="text-green-300 font-medium">{formatDate(order.deliveredAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tracking Management */}
        <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-700/50">
          <h4 className="text-white font-semibold mb-4 flex items-center">
            <Truck className="w-4 h-4 mr-2 text-cyan-400" />
            Tracking Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Tracking number"
              value={trackingDraft.trackingNumber ?? order.trackingNumber ?? ''}
              onChange={(e) => handleTrackingChange(order._id, 'trackingNumber', e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="text"
              placeholder="Shipping carrier"
              value={trackingDraft.shippingCarrier ?? order.shippingCarrier ?? ''}
              onChange={(e) => handleTrackingChange(order._id, 'shippingCarrier', e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="date"
              value={
                trackingDraft.estimatedDeliveryDate ??
                (order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toISOString().slice(0, 10) : '')
              }
              onChange={(e) => handleTrackingChange(order._id, 'estimatedDeliveryDate', e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              onClick={() => saveTrackingInfo(order)}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Save Tracking
            </button>
          </div>
          <textarea
            placeholder="Admin note or tracking update note"
            value={trackingDraft.note ?? ''}
            onChange={(e) => handleTrackingChange(order._id, 'note', e.target.value)}
            className="mt-3 w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            rows={2}
          />
          {order.statusHistory?.length > 0 && (
            <div className="mt-4 space-y-2">
              <h5 className="text-gray-300 font-medium">Status History</h5>
              {order.statusHistory.slice().reverse().map((entry, index) => (
                <div key={`${entry.status}-${entry.changedAt}-${index}`} className="text-sm text-gray-300 bg-white/5 rounded-lg p-3">
                  <span className="capitalize text-cyan-300">{entry.status}</span>
                  {entry.note && <span className="ml-2">- {entry.note}</span>}
                  <span className="block text-gray-500">
                    {entry.changedAt ? formatDate(entry.changedAt) : 'Date unavailable'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delivery Instructions */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h4 className="text-blue-400 font-semibold mb-2 flex items-center">
            <Truck className="w-4 h-4 mr-2" />
            Delivery Instructions
          </h4>
          <p className="text-blue-300 text-sm">
            <strong>3-Hour Delivery Promise:</strong> Deliver directly to the specified campus location within 3 hours of order placement. 
            Contact the customer at <strong>{order.shippingInfo?.phoneNumber || 'the provided number'}</strong> upon arrival.
            Ensure you have the exact block and room number for smooth delivery.
          </p>
          {isUrgent && (
            <div className="mt-2 flex items-center text-orange-400">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">URGENT: This order is approaching delivery deadline</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const exportOrders = () => {
    // Enhanced CSV export with detailed information
    const headers = [
      'Order ID', 'Customer Name', 'Customer Email', 'Customer Phone', 
      'Block Number', 'Room/Dorm', 'Items Count', 'Total Amount', 
      'Status', 'Payment Method', 'Order Date', 'Delivery Date', 'Time Remaining'
    ];
    
    const csvData = orders.map(order => {
      const timeRemaining = getTimeRemaining(order.createdAt);
      return [
        order.orderId || order._id,
        order.user?.name || `${order.shippingInfo?.firstName} ${order.shippingInfo?.lastName}`,
        order.user?.email || 'N/A',
        order.shippingInfo?.phoneNumber || 'N/A',
        order.shippingInfo?.blockNumber || 'N/A',
        order.shippingInfo?.roomDormNumber || 'N/A',
        order.items?.length || 0,
        order.totalPrice || 0,
        order.orderStatus,
        order.paymentInfo?.method || 'cash_on_delivery',
        formatDate(order.createdAt),
        order.deliveredAt ? formatDate(order.deliveredAt) : 'Not Delivered',
        timeRemaining.text
      ];
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-detailed-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Orders Management
          </h1>
          <p className="text-gray-400 mt-2">Manage customer orders with 3-hour delivery promise tracking</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={exportOrders}
            className="btn-primary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Orders</span>
          </button>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Orders"
          value={stats.total}
          color="bg-blue-500/20 border border-blue-500/30"
          icon={ShoppingCart}
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          color="bg-orange-500/20 border border-orange-500/30"
          icon={Clock}
          description="3-hour delivery"
        />
        <StatCard
          title="Urgent"
          value={stats.urgent}
          color="bg-red-500/20 border border-red-500/30"
          icon={AlertCircle}
          description="2+ hours pending"
        />
        <StatCard
          title="Processing"
          value={stats.processing}
          color="bg-purple-500/20 border border-purple-500/30"
          icon={Package}
        />
        <StatCard
          title="Delivered"
          value={stats.delivered}
          color="bg-green-500/20 border border-green-500/30"
          icon={CheckCircle}
        />
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by ID, customer name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => {
              const Icon = status.icon;
              return (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                    statusFilter === status.value
                      ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{status.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2 mt-4">
          {statusFilter !== 'all' && (
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
              Status: {statusOptions.find(s => s.value === statusFilter)?.label}
            </span>
          )}
          {searchTerm && (
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
              Search: "{searchTerm}"
            </span>
          )}
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
            Showing {orders.length} of {pagination.total || orders.length} orders
          </span>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length > 0 ? (
          <>
            {orders.map((order) => {
            const StatusIcon = getStatusIcon(order.orderStatus);
            const isExpanded = expandedOrder === order._id;
            const timeRemaining = getTimeRemaining(order.createdAt);
            const isUrgent = isOrderUrgent(order.createdAt);
            
            return (
              <div key={order._id} className={`glass-card p-6 ${
                isUrgent ? 'border-l-4 border-l-red-500' : ''
              }`}>
                {/* Order Summary */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Order ID</div>
                      <div className="text-white font-medium font-mono">
                        {order.orderId || order._id.slice(-8)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Customer</div>
                      <div className="text-white font-medium">
                        {order.user?.name || `${order.shippingInfo?.firstName} ${order.shippingInfo?.lastName}`}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Total</div>
                      <div className="text-cyan-400 font-semibold">{formatPrice(order.totalPrice)}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Status</div>
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(order.orderStatus)}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span className="text-sm font-medium capitalize">{order.orderStatus}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Time Remaining</div>
                      <div className={`flex items-center space-x-1 ${timeRemaining.color}`}>
                        <Timer className="w-4 h-4" />
                        <span className="text-sm font-medium">{timeRemaining.text}</span>
                        {isUrgent && <AlertCircle className="w-4 h-4 text-red-400" />}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                    
                    <button
                      onClick={() => toggleOrderDetails(order._id)}
                      className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {isExpanded && <OrderDetailsCard order={order} />}
              </div>
            );
          })}
          </>
        ) : (
          <div className="glass-card p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Orders Found</h3>
            <p className="text-gray-400 mb-6">
              {pagination.total === 0 
                ? "No orders have been placed yet."
                : "No orders match your current filters. Try adjusting your search criteria."
              }
            </p>
          </div>
        )}

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
                className="flex items-center space-x-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={!pagination.hasNextPage}
                className="flex items-center space-x-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
