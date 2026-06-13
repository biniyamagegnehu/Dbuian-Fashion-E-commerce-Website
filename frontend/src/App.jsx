import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Unauthorized from './pages/Unauthorized';

// Route protection
import AdminRoute from './components/routing/AdminRoute';
import PrivateRoute from './components/routing/PrivateRoute';

// Admin imports
import AdminLayout from './components/admin/Layout/Layout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import AdminReviews from './pages/admin/Reviews';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

const AnimatedPage = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

// Inner component that has access to useLocation (needs to be inside Router)
function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Hide storefront Navbar and Footer on admin pages */}
      {!isAdminPage && <Navbar />}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/products" element={<AnimatedPage><Products /></AnimatedPage>} />
            <Route path="/product/:id" element={<AnimatedPage><ProductDetail /></AnimatedPage>} />
            <Route path="/cart" element={<AnimatedPage><Cart /></AnimatedPage>} />
            <Route path="/checkout" element={<PrivateRoute><AnimatedPage><Checkout /></AnimatedPage></PrivateRoute>} />
            <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
            <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
            <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
            <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
            <Route path="/unauthorized" element={<AnimatedPage><Unauthorized /></AnimatedPage>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminLayout><Dashboard /></AdminLayout></AdminRoute>} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminLayout><Dashboard /></AdminLayout></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
            <Route path="/admin/reviews" element={<AdminRoute><AdminLayout><AdminReviews /></AdminLayout></AdminRoute>} />

          </Routes>
        </AnimatePresence>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;