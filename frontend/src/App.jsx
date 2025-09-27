import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
                  <Route path="/products" element={<AnimatedPage><Products /></AnimatedPage>} />
                  <Route path="/product/:id" element={<AnimatedPage><ProductDetail /></AnimatedPage>} />
                  <Route path="/cart" element={<AnimatedPage><Cart /></AnimatedPage>} />
                  <Route path="/checkout" element={<AnimatedPage><Checkout /></AnimatedPage>} />
                  <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
                  <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
                  <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
                  <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />

                </Routes>
              </AnimatePresence>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;