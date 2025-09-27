import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';

const About = () => {
  // Team members data
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      image: "/images/team-1.jpg",
      description: "Visionary leader with 10+ years in fashion tech",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Sarah Miller",
      role: "Head of Design",
      image: "/images/team-2.jpg",
      description: "Creative director specializing in campus fashion",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Michael Chen",
      role: "Tech Lead",
      image: "/images/team-3.jpg",
      description: "Innovation expert in smart fabric technology",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Emily Davis",
      role: "Campus Relations",
      image: "/images/team-4.jpg",
      description: "Connecting with universities nationwide",
      social: { linkedin: "#", twitter: "#" }
    }
  ];

  // Values data
  const values = [
    {
      icon: "🚀",
      title: "Innovation",
      description: "Pushing boundaries in campus fashion technology"
    },
    {
      icon: "🌱",
      title: "Sustainability",
      description: "Eco-friendly materials and ethical production"
    },
    {
      icon: "🎓",
      title: "Education-First",
      description: "Designed specifically for student lifestyles"
    },
    {
      icon: "💫",
      title: "Excellence",
      description: "Premium quality at accessible prices"
    }
  ];

  // Future enhancements
  const futureFeatures = [
    {
      title: "AI Style Assistant",
      description: "Personalized outfit recommendations using machine learning",
      timeline: "Q3 2024",
      status: "In Development"
    },
    {
      title: "Virtual Try-On",
      description: "AR technology to try clothes virtually before buying",
      timeline: "Q1 2025",
      status: "Planned"
    },
    {
      title: "Smart Fabric 2.0",
      description: "Clothing that adapts to weather and activity levels",
      timeline: "Q4 2024",
      status: "Research Phase"
    },
    {
      title: "Campus Delivery Drones",
      description: "30-minute delivery across university campuses",
      timeline: "Q2 2025",
      status: "Concept"
    }
  ];

  // Services data
  const services = [
    {
      icon: "👕",
      title: "Smart Campus Wear",
      description: "Clothing designed with innovative fabrics that adapt to campus life"
    },
    {
      icon: "🚚",
      title: "Fast Campus Delivery",
      description: "Free delivery to all university locations within 24 hours"
    },
    {
      icon: "🔄",
      title: "Easy Returns",
      description: "30-day hassle-free returns for all university students"
    },
    {
      icon: "💳",
      title: "Student Financing",
      description: "Flexible payment options tailored for students"
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
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
              About Dbuian Fashion
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Revolutionizing campus wear through innovation, technology, and student-centric design
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <AnimatedButton variant="primary" className="px-8 py-4 text-lg">
                  Explore Our Collection
                </AnimatedButton>
              </Link>
              <AnimatedButton variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white/10">
                Our Story
              </AnimatedButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8 backdrop-blur-xl">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl">🎯</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  To empower university students with innovative, sustainable, and technologically advanced 
                  clothing that enhances their campus experience while promoting comfort, style, and 
                  environmental responsibility.
                </p>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8 backdrop-blur-xl">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl">🔮</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  To become the leading campus fashion brand globally, recognized for pioneering 
                  smart clothing technology and setting new standards in sustainable student apparel 
                  by 2030.
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-900/50 to-gray-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive solutions designed specifically for the university lifestyle
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-6 h-full backdrop-blur-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-300">{service.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-400 text-lg">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <GlassCard className="p-6 text-center backdrop-blur-xl">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-300 text-sm">{value.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Enhancements Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-900/50 to-gray-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Future Innovations</h2>
            <p className="text-gray-400 text-lg">What's next in campus fashion technology</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {futureFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-6 backdrop-blur-xl border-l-4 border-cyan-400/50">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      feature.status === 'In Development' ? 'bg-green-400/20 text-green-300' :
                      feature.status === 'Planned' ? 'bg-blue-400/20 text-blue-300' :
                      feature.status === 'Research Phase' ? 'bg-yellow-400/20 text-yellow-300' :
                      'bg-purple-400/20 text-purple-300'
                    }`}>
                      {feature.status}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{feature.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>Timeline: {feature.timeline}</span>
                    <span className="text-cyan-400">→</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-400 text-lg">The passionate minds behind Dbuian Fashion</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <GlassCard className="p-6 text-center backdrop-blur-xl">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl text-white font-bold">{member.name.charAt(0)}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-cyan-400 text-sm mb-2">{member.role}</p>
                  <p className="text-gray-300 text-xs mb-4">{member.description}</p>
                  <div className="flex justify-center space-x-3">
                    <button className="text-gray-400 hover:text-cyan-400 transition-colors">
                      <span className="text-xs">LinkedIn</span>
                    </button>
                    <button className="text-gray-400 hover:text-cyan-400 transition-colors">
                      <span className="text-xs">Twitter</span>
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <GlassCard className="p-12 text-center backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Join the Campus Fashion Revolution
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Be part of the movement that's transforming how students experience fashion on campus. 
                Together, we're building the future of smart, sustainable student wear.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products">
                  <AnimatedButton variant="primary" className="px-8 py-4">
                    Start Shopping
                  </AnimatedButton>
                </Link>
                <Link to="/contact">
                  <AnimatedButton variant="outline" className="px-8 py-4 border-white text-white hover:bg-white/10">
                    Get In Touch
                  </AnimatedButton>
                </Link>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      {/* Stats Footer */}
      <section className="py-12 px-4 border-t border-gray-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50+", label: "University Partners" },
              { number: "10K+", label: "Happy Students" },
              { number: "98%", label: "Satisfaction Rate" },
              { number: "24/7", label: "Student Support" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;