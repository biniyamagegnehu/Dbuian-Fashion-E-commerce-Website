import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const AccountLayout = () => {
  const { user } = useAuth();

  const navItems = [
    { name: 'Profile', path: '/account/profile', icon: '👤' },
    { name: 'Security', path: '/account/security', icon: '🔒' },
    { name: 'Orders', path: '/account/orders', icon: '📦' },
    { name: 'Delivery Info', path: '/account/delivery', icon: '🚚' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
            My Account
          </h1>
          <p className="text-gray-400 mt-2">Manage your profile, security, and orders.</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-64 flex-shrink-0"
          >
            <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden sticky top-28">
              <div className="p-6 border-b border-white/10 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-white font-semibold truncate">{user?.name}</h3>
                  <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                </div>
              </div>
              <nav className="p-4 space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => 
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                      }`
                    }
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-grow"
          >
            <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 min-h-[500px]">
              <Outlet />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
