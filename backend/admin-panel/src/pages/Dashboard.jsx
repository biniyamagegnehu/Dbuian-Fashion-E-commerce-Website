import { useState, useEffect } from 'react';
import { usersAPI, ordersAPI, productsAPI } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Clock,
  Plus,
  Eye,
  Settings,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, ordersRes, productsRes] = await Promise.all([
        usersAPI.getStats(),
        ordersAPI.getAll(),
        productsAPI.getAll()
      ]);

      const totalRevenue = ordersRes.data.orders.reduce((sum, order) => sum + order.totalPrice, 0);
      const pendingOrders = ordersRes.data.orders.filter(order => order.orderStatus === 'pending').length;
      
      // Calculate revenue growth (mock data for now)
      const revenueGrowth = 15.2;
      const userGrowth = 8.7;

      // Generate recent activity from orders
      const activity = ordersRes.data.orders.slice(0, 4).map(order => ({
        id: order._id,
        type: 'order',
        title: `New Order #${order.orderId}`,
        description: `${order.items.length} items • ${order.totalPrice} Birr`,
        time: 'Just now',
        icon: '📦',
        color: 'green'
      }));

      setStats({
        totalUsers: usersRes.data.stats.totalUsers,
        totalOrders: ordersRes.data.count,
        totalProducts: productsRes.data.total,
        totalRevenue,
        pendingOrders,
        revenueGrowth,
        userGrowth
      });

      setRecentActivity(activity);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, growth, color, prefix, suffix }) => (
    <div className="glass-card p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">
            {prefix}{value?.toLocaleString()}{suffix}
          </p>
          {growth && (
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">+{growth}%</span>
              <span className="text-gray-400 text-sm">from last month</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ icon, title, description, onClick, color }) => (
    <button 
      onClick={onClick}
      className="glass-card p-4 text-left hover:transform hover:scale-105 transition-all duration-300 group cursor-pointer"
    >
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h4 className="font-semibold text-white mb-1">{title}</h4>
      <p className="text-gray-400 text-sm">{description}</p>
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 mt-2">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn-primary flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers}
          icon={<Users className="w-6 h-6 text-blue-400" />}
          growth={stats?.userGrowth}
          color="bg-blue-500/20 border border-blue-500/30"
        />
        
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders}
          icon={<ShoppingCart className="w-6 h-6 text-green-400" />}
          color="bg-green-500/20 border border-green-500/30"
        />
        
        <StatCard
          title="Total Products"
          value={stats?.totalProducts}
          icon={<Package className="w-6 h-6 text-purple-400" />}
          color="bg-purple-500/20 border border-purple-500/30"
        />
        
        <StatCard
          title="Total Revenue"
          value={stats?.totalRevenue}
          prefix="ETB "
          suffix=""
          icon={<DollarSign className="w-6 h-6 text-cyan-400" />}
          growth={stats?.revenueGrowth}
          color="bg-cyan-500/20 border border-cyan-500/30"
        />
      </div>

      {/* Pending Orders Alert */}
      {stats?.pendingOrders > 0 && (
        <div className="glass-card p-4 border-l-4 border-orange-400 bg-orange-500/10">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-orange-400 font-semibold">
                {stats.pendingOrders} pending orders need attention
              </p>
              <p className="text-orange-300 text-sm">
                Review and process these orders to ensure timely delivery
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
              <Settings className="w-5 h-5 text-cyan-400" />
              <span>Quick Actions</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <QuickAction
                icon={<Plus className="w-5 h-5 text-green-400" />}
                title="Add Product"
                description="Create new product listing"
                color="bg-green-500/20 border border-green-500/30"
              />
              <QuickAction
                icon={<Eye className="w-5 h-5 text-blue-400" />}
                title="View Orders"
                description="Manage all orders"
                color="bg-blue-500/20 border border-blue-500/30"
              />
              <QuickAction
                icon={<Users className="w-5 h-5 text-purple-400" />}
                title="Manage Users"
                description="User management panel"
                color="bg-purple-500/20 border border-purple-500/30"
              />
              <QuickAction
                icon={<BarChart3 className="w-5 h-5 text-cyan-400" />}
                title="Analytics"
                description="View detailed reports"
                color="bg-cyan-500/20 border border-cyan-500/30"
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span>Recent Activity</span>
            </h3>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div 
                    key={activity.id}
                    className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200 cursor-pointer group"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.color === 'green' ? 'bg-green-500/20' : 
                      activity.color === 'blue' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                    } group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-lg">{activity.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{activity.title}</p>
                      <p className="text-gray-400 text-sm">{activity.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 text-sm font-medium">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-6">
          {/* Performance Card */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>Performance</span>
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-gray-300">Order Completion</span>
                <span className="text-green-400 font-semibold">94%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-gray-300">Customer Satisfaction</span>
                <span className="text-green-400 font-semibold">4.8/5</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-gray-300">Inventory Turnover</span>
                <span className="text-cyan-400 font-semibold">2.3x</span>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-6">System Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">API Status</span>
                <span className="text-green-400 font-semibold flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Operational</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Database</span>
                <span className="text-green-400 font-semibold flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Connected</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Last Backup</span>
                <span className="text-cyan-400 font-semibold">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;