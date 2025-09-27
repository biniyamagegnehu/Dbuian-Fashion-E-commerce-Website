import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';

const About = () => {
  // Team members data
  const teamMembers = [
    {
      name: "Daniel B.",
      role: "Project Lead & Developer",
      description: "Computer Science Student",
      contribution: "Full-stack development & project management"
    },
    {
      name: "Sara M.",
      role: "Frontend Developer",
      description: "Software Engineering Student",
      contribution: "UI/UX design and frontend implementation"
    },
    {
      name: "Alex K.",
      role: "Backend Developer",
      description: "IT Student",
      contribution: "Database architecture & API development"
    },
    {
      name: "Maya T.",
      role: "Content & Marketing",
      description: "Business Technology Student",
      contribution: "Brand strategy & user experience"
    }
  ];

  // Services data
  const services = [
    {
      icon: "👕",
      title: "University Merchandise",
      description: "Official university-branded clothing and accessories"
    },
    {
      icon: "🎓",
      title: "Campus Casual Wear",
      description: "Perfect outfits for lectures, labs, and campus life"
    },
    {
      icon: "💻",
      title: "Easy Online Shopping",
      description: "Browse, filter, and order in minutes from any device"
    },
    {
      icon: "🚀",
      title: "Exclusive Access",
      description: "Available only to students, staff, and faculty members"
    }
  ];

  // Benefits data
  const benefits = [
    {
      icon: "💰",
      title: "Student-Friendly Pricing",
      description: "Affordable prices designed specifically for student budgets"
    },
    {
      icon: "🎨",
      title: "University-Tailored Fashion",
      description: "Styles that match campus life and university culture"
    },
    {
      icon: "⚡",
      title: "Futuristic Experience",
      description: "Modern, intuitive online shopping platform"
    },
    {
      icon: "📦",
      title: "Campus Delivery",
      description: "Convenient pickup and delivery options on campus"
    }
  ];

  // Future features
  const futureFeatures = [
    {
      title: "AI Style Assistant",
      description: "Personalized outfit recommendations based on your preferences",
      status: "Coming Soon"
    },
    {
      title: "Virtual Try-On",
      description: "See how clothes look on you before ordering",
      status: "In Development"
    },
    {
      title: "Mobile App",
      description: "Shop on the go with our dedicated campus fashion app",
      status: "Planned"
    },
    {
      title: "Collaboration Collections",
      description: "Exclusive designs from student artists and clubs",
      status: "In Planning"
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
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <span className="text-white font-bold text-2xl">D</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                About Dbuian Fashion
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              The official online clothing store for the university community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <AnimatedButton variant="primary" className="px-8 py-4 text-lg">
                  Explore Collections
                </AnimatedButton>
              </Link>
              <Link to="/contact">
                <AnimatedButton variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white/10">
                  Contact Us
                </AnimatedButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Who We Are</h2>
            <GlassCard className="p-8 backdrop-blur-xl">
              <p className="text-lg text-gray-300 leading-relaxed">
                <span className="text-cyan-400 font-semibold">Dbuian Fashion</span> is the official online clothing store of Debre Berhan University. 
                We provide a simple and futuristic shopping experience for students, staff, and faculty. 
                Our mission is to make university fashion accessible, trendy, and convenient — right at your fingertips.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Our Purpose Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-900/50 to-gray-900">
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
                <h2 className="text-3xl font-bold mb-4">Our Purpose</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  We noticed students often struggled to find quality campus wear, casual outfits, 
                  and trendy clothes all in one place. That's why we built Dbuian Fashion — to connect 
                  the university community with stylish and affordable clothing designed for everyday campus life.
                </p>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-6xl mb-4">🎓</div>
              <h3 className="text-2xl font-semibold mb-4">Built for the University Community</h3>
              <p className="text-gray-300">
                Designed by students, for students — understanding exactly what the campus life demands.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">What We Offer</h2>
            <p className="text-gray-400 text-lg">Everything you need for campus style in one place</p>
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
                <GlassCard className="p-6 h-full backdrop-blur-xl text-center border border-white/10 hover:border-cyan-400/30 transition-all duration-300">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-300 text-sm">{service.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-900/50 to-gray-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose Dbuian Fashion</h2>
            <p className="text-gray-400 text-lg">The student-friendly advantage</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <GlassCard className="p-6 text-center backdrop-blur-xl">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-gray-300 text-sm">{benefit.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Vision Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Future Vision</h2>
            <p className="text-gray-400 text-lg">Growing together with the university community</p>
          </motion.div>

          <div className="max-w-3xl mx-auto text-center mb-12">
            <GlassCard className="p-8 backdrop-blur-xl">
              <p className="text-lg text-gray-300 leading-relaxed">
                This project started as a student-led initiative. In the future, we aim to expand with more collections, 
                collaborations, and tech features like personalized AI styling recommendations, virtual try-ons, 
                and exclusive partnerships with student organizations.
              </p>
            </GlassCard>
          </div>

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
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-400/20 text-cyan-300">
                      {feature.status}
                    </span>
                  </div>
                  <p className="text-gray-300">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-900/50 to-gray-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Built by Students of DBU</h2>
            <p className="text-gray-400 text-lg">The passionate team behind Dbuian Fashion</p>
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
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl text-white font-bold">{member.name.charAt(0)}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-cyan-400 text-sm mb-2">{member.role}</p>
                  <p className="text-gray-300 text-xs mb-2">{member.description}</p>
                  <p className="text-gray-400 text-xs">{member.contribution}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
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
                Join Us in Redefining University Fashion
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Explore our collections today and show your Dbuian style! Together, we're building 
                the future of campus fashion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products">
                  <AnimatedButton variant="primary" className="px-8 py-4 text-lg">
                    Start Shopping Now
                  </AnimatedButton>
                </Link>
                <Link to="/register">
                  <AnimatedButton variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white/10">
                    Create Account
                  </AnimatedButton>
                </Link>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-4 border-t border-gray-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "1000+", label: "Happy Students" },
              { number: "50+", label: "Style Options" },
              { number: "24/7", label: "Online Access" },
              { number: "100%", label: "Campus Focused" }
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