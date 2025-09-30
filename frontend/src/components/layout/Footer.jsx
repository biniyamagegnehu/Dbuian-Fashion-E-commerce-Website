import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/dbuianfashion',
      icon: '📸',
      handle: '@dbuianfashion'
    },
    {
      name: 'Telegram',
      href: 'https://t.me/dbuianfashion',
      icon: '📢',
      handle: 't.me/dbuianfashion'
    },
    {
      name: 'Email',
      href: 'mailto:support@dbuianfashion.com',
      icon: '📧',
      handle: 'support@dbuianfashion.com'
    }
  ];

  const footerLinks = {
    shop: [
      { name: 'All Products', href: '/products' },
      { name: 'New Arrivals', href: '/products?filter=new' },
      { name: 'Trending Now', href: '/products?filter=trending' },
      { name: 'Best Sellers', href: '/products?filter=bestsellers' },
    ],
    support: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'Size Guide', href: '/size-guide' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns & Exchanges', href: '/returns' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Story', href: '/about#story' },
      { name: 'Campus Delivery', href: '/delivery' },
      { name: 'Careers', href: '/careers' },
    ],
    policies: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Return Policy', href: '/returns' },
    ]
  };

  const campusInfo = {
    location: 'Debre Berhan University Campus',
    hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
    delivery: '1 hour campus delivery',
    contact: 'support@dbuianfashion.com'
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 z-0 opacity-5">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
            style={{
              width: Math.random() * 100 + 30,
              height: Math.random() * 100 + 30,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 50 - 25],
              x: [0, Math.random() * 50 - 25],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center space-x-3 mb-6">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center"
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-white font-bold text-xl">D</span>
              </motion.div>
              <div>
                <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 block">
                  Dbuian Fashion
                </span>
                <p className="text-cyan-400 text-sm">Campus Exclusive Apparel</p>
              </div>
            </div>
            <p className="text-gray-400 max-w-md mb-6 leading-relaxed">
              Your premier campus fashion destination at Debre Berhan University. 
              Experience futuristic designs with direct-to-dormitory delivery and student-friendly pricing.
            </p>
            
            {/* Campus Information */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center text-gray-300 text-sm">
                <span className="mr-2">📍</span>
                {campusInfo.location}
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <span className="mr-2">🕒</span>
                {campusInfo.hours}
              </div>
              <div className="flex items-center text-cyan-400 text-sm">
                <span className="mr-2">🚀</span>
                {campusInfo.delivery}
              </div>
            </div>

            {/* Social links - Updated with emojis */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-800/50 rounded-xl text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all border border-gray-700 hover:border-cyan-400/30 group"
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1 group-hover:scale-110 transition-transform">
                      {social.icon}
                    </div>
                    <div className="text-xs text-gray-500 group-hover:text-cyan-300">
                      {social.name}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer links */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider flex items-center">
                <span className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full mr-2"></span>
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center group"
                    >
                      <span className="w-1 h-1 bg-gray-600 rounded-full mr-2 group-hover:bg-cyan-400 transition-colors"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

        </div>

        {/* Campus Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-gray-800"
        >
          {[
            { icon: '🎓', title: 'Student Exclusive', desc: 'For DBU community only' },
            { icon: '🚀', title: 'Fast Delivery', desc: '1 hour on campus' },
            { icon: '⭐', title: 'Verified Reviews', desc: 'From real students' },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-4 bg-gray-800/20 rounded-xl border border-gray-700/30 hover:border-cyan-400/20 transition-all"
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h4 className="text-cyan-400 font-semibold text-sm mb-1">{feature.title}</h4>
              <p className="text-gray-400 text-xs">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="text-center md:text-left">
            <p className="text-gray-500 text-sm">
              © {currentYear} Dbuian Fashion - Debre Berhan University. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Designed for the modern student • Built with ❤️ for DBU community
            </p>
          </div>
          
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-500 text-sm">Online now</span>
            </div>
            <div className="text-gray-500 text-sm">
              🎓 Exclusive for DBU Students
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced gradient bar */}
      <div className="h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 relative">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
          animate={{ x: [-100, 400] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
        />
      </div>
    </footer>
  );
};

export default Footer;