import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('day');
  const sectionRefs = useRef([]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  // Set time of day based on actual time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
      setTimeOfDay('day');
    } else {
      setTimeOfDay('night');
    }
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        
        // Get unique categories from actual products
        const uniqueCategories = [...new Set(products.map(product => product.category))];
        const categoryCounts = uniqueCategories.map(category => ({
          name: category,
          icon: getCategoryIcon(category),
          color: getCategoryColor(category),
          count: products.filter(p => p.category === category).length
        }));
        
        setCategories(categoryCounts);
        setFeaturedProducts(products.filter(p => p.featured).slice(0, 4));
        setTrendingProducts(products.filter(p => p.trending).slice(0, 4));
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const getCategoryIcon = (category) => {
    const icons = {
      'T-Shirts': '👕',
      'Hoodies & Sweatshirts': '🧥',
      'Jackets & Coats': '🧥',
      'Pants & Trousers': '👖',
      'Jeans': '👖',
      'Dresses': '👗',
      'Skirts': '👗',
      'Footwear': '👟'
    };
    return icons[category] || '👕';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'T-Shirts': 'from-blue-500 to-cyan-500',
      'Hoodies & Sweatshirts': 'from-purple-500 to-pink-500',
      'Jackets & Coats': 'from-green-500 to-emerald-500',
      'Pants & Trousers': 'from-yellow-500 to-orange-500',
      'Jeans': 'from-red-500 to-rose-500',
      'Dresses': 'from-indigo-500 to-purple-500',
      'Skirts': 'from-teal-500 to-blue-500',
      'Footwear': 'from-orange-500 to-red-500'
    };
    return colors[category] || 'from-gray-500 to-gray-700';
  };

  const handleMouseMove = (event) => {
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - left) / width - 0.5;
    const y = (event.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const categoriesData = [
    { name: "Hoodies", icon: "🧥", color: "from-blue-500 to-cyan-500", count: 24 },
    { name: "T-Shirts", icon: "👕", color: "from-purple-500 to-pink-500", count: 32 },
    { name: "Pants", icon: "👖", color: "from-green-500 to-emerald-500", count: 18 },
    { name: "Accessories", icon: "🕶️", color: "from-yellow-500 to-orange-500", count: 15 },
    { name: "Footwear", icon: "👟", color: "from-red-500 to-rose-500", count: 12 },
  ];

  // Particle background component
  const ParticleBackground = () => {
    return (
      <div className="fixed inset-0 z-0 overflow-hidden">
        {[...Array(timeOfDay === 'day' ? 20 : 30)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              timeOfDay === 'day' 
                ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10" 
                : "bg-gradient-to-r from-cyan-400/5 to-blue-400/5"
            }`}
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
              rotate: [0, 180],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
        
        {/* Floating shapes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`shape-${i}`}
            className={`absolute ${
              i % 3 === 0 ? "rounded-lg" : i % 3 === 1 ? "rounded-full" : "rotate-45"
            } ${timeOfDay === 'day' ? "bg-indigo-500/5" : "bg-cyan-400/5"} border ${
              timeOfDay === 'day' ? "border-indigo-500/10" : "border-cyan-400/10"
            }`}
            style={{
              width: Math.random() * 80 + 40,
              height: Math.random() * 80 + 40,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 40 - 20],
              x: [0, Math.random() * 40 - 20],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    );
  };

  // Interactive stats counter component
  const StatsCounter = ({ value, label, duration = 2 }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      let start = 0;
      const end = parseInt(value);
      if (start === end) return;
      
      const totalMilSecDur = duration * 1000;
      const incrementTime = (totalMilSecDur / end) * 10;
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);
      
      return () => clearInterval(timer);
    }, [value, duration]);
    
    return (
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
          {count}+
        </div>
        <div className="text-gray-400 mt-2">{label}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 origin-left z-50"
        style={{ scaleX }}
      />
      
      <ParticleBackground />

      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center px-4"
        onMouseMove={handleMouseMove}
        ref={el => sectionRefs.current[0] = el}
      >
        <div className={`absolute inset-0 ${
          timeOfDay === 'day' 
            ? "bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-pink-900/40" 
            : "bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-cyan-900/30"
        }`} />
        
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
        
        <motion.div 
          className="relative z-10 text-center max-w-4xl"
          style={{ rotateX, rotateY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <span className="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm">Exclusive for university students</span>
            </div>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Future Fashion
            <br />
            <span className="text-white">For Campus Life</span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover clothing that blends cutting-edge technology with urban style, designed exclusively for the academic environment.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/products">
              <AnimatedButton variant="glass" className="px-8 py-4 text-lg">
                Explore Collection
              </AnimatedButton>
            </Link>
            <AnimatedButton variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white/10">
              <span>View Lookbook</span>
            </AnimatedButton>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 px-4" ref={el => sectionRefs.current[1] = el}>
        <div className="container mx-auto">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <StatsCounter value="5000" label="Users" />
            <StatsCounter value="120" label="University Partners" />
            <StatsCounter value="98" label="Positive Reviews" />
            <StatsCounter value="24" label="Hour Support" />
          </motion.div>
        </div>
      </section>

      {/* Updated Categories Section */}
      <section className="relative z-10 py-16 px-4" ref={el => sectionRefs.current[2] = el}>
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Shop by Category
          </motion.h2>
          <motion.p 
            className="text-gray-400 text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {categories.length > 0 
              ? `Discover ${categories.reduce((sum, cat) => sum + cat.count, 0)} innovative products across ${categories.length} categories`
              : 'Discover our innovative collections designed for campus life'
            }
          </motion.p>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" text="Loading categories..." />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
                {(categories.length > 0 ? categories : categoriesData).slice(0, 5).map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex justify-center"
                  >
                    <button
                      onClick={() => setActiveCategory(index)}
                      className={`flex flex-col items-center p-4 rounded-2xl w-full transition-all duration-300 ${
                        activeCategory === index
                          ? 'bg-white/20 backdrop-blur-md border border-white/30'
                          : 'bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20'
                      }`}
                    >
                      <span className="text-3xl mb-2">{category.icon}</span>
                      <span className="text-sm font-medium">{category.name}</span>
                      <span className="text-xs text-gray-400 mt-1">{category.count} items</span>
                    </button>
                  </motion.div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className={`inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${
                    categories.length > 0 ? categories[activeCategory]?.color : categoriesData[activeCategory].color
                  } mb-4`}>
                    <span className="text-lg font-semibold">
                      New {(categories.length > 0 ? categories[activeCategory]?.name : categoriesData[activeCategory].name)} Collection
                    </span>
                  </div>
                  <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                    Discover our latest {(categories.length > 0 ? categories[activeCategory]?.name.toLowerCase() : categoriesData[activeCategory].name.toLowerCase())} designed with innovative materials and futuristic aesthetics.
                  </p>
                  <Link to={`/products?category=${categories.length > 0 ? categories[activeCategory]?.name : categoriesData[activeCategory].name}`}>
                    <AnimatedButton variant="outline" className="border-white text-white hover:bg-white/10">
                      View All {categories.length > 0 ? categories[activeCategory]?.name : categoriesData[activeCategory].name}
                    </AnimatedButton>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </section>

      {/* Featured Products Section with 3D tilt effect */}
      <section className="relative z-10 py-16 px-4 bg-gradient-to-b from-gray-900/50 to-gray-900" ref={el => sectionRefs.current[3] = el}>
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Featured Collection
          </motion.h2>
          <motion.p 
            className="text-gray-400 text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Curated pieces that represent the future of campus fashion
          </motion.p>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" color="white" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -15, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="relative"
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Updated Technology Section with Realistic Promotions */}
      <section className="relative z-10 py-24 px-4" ref={el => sectionRefs.current[4] = el}>
        <div className="container mx-auto">
          <GlassCard className="p-8 md:p-12 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Smart Campus Technology</h2>
                <p className="text-gray-300 mb-6">
                  Our clothing incorporates real-world innovations that make campus life easier, more comfortable, and more sustainable.
                </p>
                
                {/* Realistic Product Features */}
                <div className="mb-8 space-y-4">
                  {[
                    { 
                      title: "Temperature Adaptive Fabric", 
                      desc: "Maintains optimal body temperature between classes, labs, and outdoor activities",
                      icon: "🌡️",
                      benefit: "No more carrying extra layers"
                    },
                    { 
                      title: "Stain-Resistant Technology", 
                      desc: "Spill coffee during early lectures? Our fabrics repel liquids instantly",
                      icon: "☕",
                      benefit: "Perfect for busy students"
                    },
                    { 
                      title: "Eco-Friendly Materials", 
                      desc: "Made from recycled plastics and sustainable fibers - good for your wallet and the planet",
                      icon: "🌱",
                      benefit: "Save 30% on water usage"
                    },
                    { 
                      title: "Extended Durability", 
                      desc: "Designed to withstand daily campus wear with reinforced stitching and premium materials",
                      icon: "💪",
                      benefit: "Lasts 2x longer than regular clothing"
                    },
                  ].map((feature, i) => (
                    <motion.div 
                      key={i}
                      className="flex items-start p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-2xl mr-4">{feature.icon}</span>
                      <div>
                        <h4 className="font-semibold text-white">{feature.title}</h4>
                        <p className="text-sm text-gray-400 mb-1">{feature.desc}</p>
                        <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-full">
                          {feature.benefit}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex gap-4">
                  <AnimatedButton variant="glass" className="border-white text-white">
                    Learn More
                  </AnimatedButton>
                  <Link to="/products">
                    <AnimatedButton variant="primary">
                      Shop Smart Collection
                    </AnimatedButton>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Realistic Technology Demo */}
                <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl overflow-hidden flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <span className="text-4xl">⚡</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Proven Campus Benefits</h3>
                    <p className="text-gray-400 mb-4">Based on real student feedback and testing</p>
                    
                    {/* Real Statistics */}
                    <div className="mt-6 space-y-4">
                      {[
                        { label: "Comfort Improvement", value: 89, color: "from-green-400 to-emerald-400" },
                        { label: "Durability Increase", value: 92, color: "from-blue-400 to-cyan-400" },
                        { label: "Style Satisfaction", value: 95, color: "from-purple-400 to-pink-400" },
                        { label: "Cost Savings/Year", value: 45, color: "from-yellow-400 to-orange-400" }
                      ].map((stat, index) => (
                        <div key={stat.label} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">{stat.label}</span>
                            <span className="text-cyan-400">{stat.value}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <motion.div
                              className={`h-2 rounded-full bg-gradient-to-r ${stat.color}`}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${stat.value}%` }}
                              transition={{ duration: 1.5, delay: index * 0.2 }}
                              viewport={{ once: true }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Real Student Testimonial */}
                <GlassCard className="p-4 mt-6 backdrop-blur-xl border border-cyan-400/20">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold">S</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">"These clothes actually survive all-night study sessions!"</p>
                      <p className="text-xs text-cyan-400">- Sarah, Computer Science Major</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Trending Now Section with auto-scroll carousel */}
      <section className="relative z-10 py-16 px-4" ref={el => sectionRefs.current[5] = el}>
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Trending Now
          </motion.h2>
          <motion.p 
            className="text-gray-400 text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Discover what's popular on campus right now
          </motion.p>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" color="white" />
            </div>
          ) : (
            <div className="overflow-hidden">
              <motion.div 
                className="flex gap-8"
                animate={{ x: [0, -1200] }}
                transition={{ 
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear"
                  }
                }}
              >
                {[...trendingProducts, ...trendingProducts].map((product, index) => (
                  <motion.div
                    key={`${product.id}-${index}`}
                    className="w-80 flex-shrink-0"
                    whileHover={{ y: -15, transition: { duration: 0.3 } }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section with newsletter signup */}
      <section className="relative z-10 py-24 px-4" ref={el => sectionRefs.current[6] = el}>
        <div className="container mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Transform Your Campus Style?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of students who have already upgraded their wardrobe with our futuristic designs.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/products">
              <AnimatedButton variant="primary" className="px-8 py-4 text-lg">
                Shop Now
              </AnimatedButton>
            </Link>
            <AnimatedButton variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white/10">
              <span>Book a Style Consultation</span>
            </AnimatedButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;