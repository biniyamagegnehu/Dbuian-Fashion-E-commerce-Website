// Contact.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    }, 2000);
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Us',
      details: 'support@dbuianfashion.com',
      description: 'Send us an email anytime',
      link: 'mailto:support@dbuianfashion.com'
    },
    {
      icon: '📱',
      title: 'WhatsApp',
      details: '+251 9XX XXX XXX',
      description: 'Chat with us directly',
      link: 'https://wa.me/251900000000'
    },
    {
      icon: '🏫',
      title: 'Campus Office',
      details: 'DBU Student Center, Room 205',
      description: 'Visit us during office hours',
      link: '#location'
    },
    {
      icon: '🕒',
      title: 'Response Time',
      details: 'Within 24 hours',
      description: 'We reply quickly to all inquiries',
      link: null
    }
  ];

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Browse our products, add items to cart, and proceed to checkout. You'll need a valid university email to register."
    },
    {
      question: "Where can I pick up my order?",
      answer: "Orders can be picked up at our campus office in the Student Center, Room 205, during business hours (8:00 AM - 5:00 PM, Monday-Friday)."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We currently accept cash on delivery (COD) and soon will integrate mobile banking and card payments."
    },
    {
      question: "Can I return or exchange items?",
      answer: "Yes! We offer 30-day returns for unworn items with tags attached. Exchanges are subject to availability."
    },
    {
      question: "Do you offer student discounts?",
      answer: "Absolutely! All DBU students receive automatic discounts on purchases. Make sure to register with your university email."
    }
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      icon: '📸',
      url: 'https://instagram.com/dbuianfashion',
      handle: '@dbuianfashion'
    },
    {
      name: 'Telegram',
      icon: '📢',
      url: 'https://t.me/dbuianfashion',
      handle: 't.me/dbuianfashion'
    },
    {
      name: 'Facebook',
      icon: '👥',
      url: 'https://facebook.com/dbuianfashion',
      handle: 'fb.com/dbuianfashion'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: 'https://twitter.com/dbuianfashion',
      handle: '@dbuianfashion'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-purple-900/10 to-pink-900/20" />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-6">
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              We're here to help! Reach out to the Dbuian Fashion team for any questions, 
              feedback, or support you might need.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Methods</h2>
            <p className="text-gray-400 text-lg">Choose your preferred way to reach us</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-6 text-center backdrop-blur-xl h-full hover:border-cyan-400/30 transition-all duration-300">
                  <div className="text-4xl mb-4">{method.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{method.title}</h3>
                  <p className="text-cyan-400 font-medium mb-2">{method.details}</p>
                  <p className="text-gray-300 text-sm mb-4">{method.description}</p>
                  {method.link && (
                    <a 
                      href={method.link} 
                      className="inline-block px-4 py-2 bg-cyan-400/10 text-cyan-400 rounded-lg hover:bg-cyan-400/20 transition-colors text-sm"
                    >
                      Contact via {method.title}
                    </a>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-900/50 to-gray-900">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8 backdrop-blur-xl">
                <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
                
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">✓</span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-gray-300 mb-6">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-2 bg-cyan-400/10 text-cyan-400 rounded-lg hover:bg-cyan-400/20 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-500"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                          University Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-500"
                          placeholder="you@dbu.edu.et"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                        Inquiry Type
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="order">Order Issue</option>
                        <option value="feedback">Feedback</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-500"
                        placeholder="Brief subject of your message"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-500 resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <AnimatedButton
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending Message...
                        </div>
                      ) : (
                        'Send Message'
                      )}
                    </AnimatedButton>
                  </form>
                )}
              </GlassCard>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Campus Location */}
              <GlassCard className="p-6 backdrop-blur-xl">
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                  <span className="mr-3">📍</span>
                  Campus Location
                </h3>
                <div className="space-y-3">
                  <p className="text-gray-300">
                    <strong>Dbuian Fashion Office</strong><br />
                    Student Center Building, Room 205<br />
                    Debre Berhan University<br />
                    Debre Berhan, Ethiopia
                  </p>
                  <div className="bg-gray-800/50 p-4 rounded-lg mt-4">
                    <h4 className="font-semibold text-cyan-400 mb-2">Office Hours</h4>
                    <p className="text-sm text-gray-300">
                      Monday - Friday: 8:00 AM - 5:00 PM<br />
                      Saturday: 9:00 AM - 1:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Social Media */}
              <GlassCard className="p-6 backdrop-blur-xl">
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                  <span className="mr-3">🌐</span>
                  Follow Us
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-gray-800/50 rounded-lg hover:bg-cyan-400/10 transition-colors group"
                    >
                      <span className="text-2xl mr-3">{social.icon}</span>
                      <div>
                        <div className="font-medium text-white group-hover:text-cyan-400">
                          {social.name}
                        </div>
                        <div className="text-xs text-gray-400">{social.handle}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </GlassCard>

              {/* Quick Support */}
              <GlassCard className="p-6 backdrop-blur-xl">
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                  <span className="mr-3">⚡</span>
                  Quick Support
                </h3>
                <p className="text-gray-300 mb-4">
                  For urgent order-related issues, contact us directly via WhatsApp for the fastest response.
                </p>
                <a
                  href="https://wa.me/251900000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                >
                  <span className="mr-2">💬</span>
                  Chat on WhatsApp
                </a>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400 text-lg">Quick answers to common questions</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <GlassCard className="p-6 backdrop-blur-xl">
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2">Q: {faq.question}</h3>
                    <p className="text-gray-300">A: {faq.answer}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <p className="text-gray-400 mb-4">
                Still have questions? Don't hesitate to contact us directly!
              </p>
              <Link to="/contact">
                <AnimatedButton variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
                  Contact Support
                </AnimatedButton>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <GlassCard className="p-12 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Campus Style?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of DBU students who have already upgraded their wardrobe with our futuristic designs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products">
                  <AnimatedButton variant="primary" className="px-8 py-4 text-lg">
                    Start Shopping Now
                  </AnimatedButton>
                </Link>
                <Link to="/about">
                  <AnimatedButton variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white/10">
                    Learn More About Us
                  </AnimatedButton>
                </Link>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
};

export default Contact;