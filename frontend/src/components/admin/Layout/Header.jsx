import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, LogOut, Settings, User, Mail } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { adminDashboardAPI } from '../../../services/api';

const Header = ({ onMenuClick, user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(3);
  
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);

  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await adminDashboardAPI.getNotifications();
        if (response.data && response.data.data) {
          setNotifications(response.data.data);
          setUnreadCount(response.data.data.filter(n => !n.read).length);
        }
      } catch (error) {
        console.error('Error fetching admin notifications:', error);
      }
    };

    fetchNotifications();
    
    // Optional: Set up an interval to refresh notifications every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to search results or filter relevant pages
      console.log('Searching for:', searchTerm);
      // You can implement global search functionality here
      alert(`Search functionality for "${searchTerm}" will be implemented`);
      setSearchTerm('');
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read and navigate
    const updatedNotifications = notifications.map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
    setShowNotifications(false);
    
    // Navigate to the relevant page
    if (notification.action) {
      navigate(notification.action);
    }
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return '🛒';
      case 'user':
        return '👤';
      case 'review':
        return '⭐';
      case 'system':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'order':
        return 'bg-green-500/20 text-green-400';
      case 'user':
        return 'bg-blue-500/20 text-blue-400';
      case 'review':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'system':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <header className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, products, users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400 w-64 transition-all duration-200"
            />
            {searchTerm && (
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                ↵
              </button>
            )}
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors relative group"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-[22rem] sm:w-[26rem] bg-[#1a1f2e]/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all duration-200">
                <div className="p-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-lg">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-cyan-400 text-sm font-medium hover:text-cyan-300 hover:underline transition-all"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="max-h-[26rem] overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`group p-4 border-b border-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer relative ${
                          !notification.read ? 'bg-cyan-500/5' : ''
                        }`}
                      >
                        {/* Unread indicator line */}
                        {!notification.read && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
                        )}
                        
                        <div className="flex items-start space-x-4 pl-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border border-white/5 shadow-inner ${getNotificationColor(notification.type)} group-hover:scale-105 transition-transform duration-200`}>
                            <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <p className={`font-semibold text-sm truncate pr-2 ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                                {notification.title}
                              </p>
                              <span className="text-xs text-gray-500 whitespace-nowrap pt-0.5">
                                {notification.time}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm line-clamp-2 leading-snug group-hover:text-gray-300 transition-colors">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Bell className="w-8 h-8 text-gray-500" />
                      </div>
                      <p className="text-gray-300 font-medium">All caught up!</p>
                      <p className="text-gray-500 text-sm mt-1">No new notifications right now</p>
                    </div>
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-white/10 bg-white/5">
                    <button className="w-full py-2 text-center text-cyan-400 font-medium text-sm rounded-lg hover:bg-white/10 hover:text-cyan-300 transition-all duration-200">
                      View All Notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-white">{user?.name || 'Admin User'}</div>
                <div className="text-xs text-gray-400">Administrator</div>
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-12 w-64 glass-card border border-white/10 rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user?.name?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{user?.name || 'Admin User'}</p>
                      <p className="text-gray-400 text-sm">{user?.email || 'admin@dbuian.com'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-white text-sm">Profile Settings</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left">
                    <Settings className="w-4 h-4 text-gray-400" />
                    <span className="text-white text-sm">Account Settings</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-white text-sm">Support</span>
                  </button>
                </div>
                
                <div className="p-3 border-t border-white/10">
                  <button
                    onClick={() => logout(() => navigate('/login'))}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
