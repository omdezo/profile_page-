import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaRocket } from 'react-icons/fa';
function useParticles(containerRef) {
  const [particles, setParticles] = useState([]);

  // Spawn a particle at (x, y) with random properties
  const spawnParticle = (x, y) => {
    // ~20% chance to actually spawn a particle on each mousemove
    if (Math.random() < 0.8) return;

    setParticles((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        x,
        y,
        angle: Math.random() * 2 * Math.PI,
        speed: Math.random() * 2 + 1,
        size: Math.random() * 4 + 2,
        life: 1,
        color: `hsl(${Math.random() * 60 + 180}, 100%, 50%)`,
      },
    ]);
  };

  // Animate particles over time
  useEffect(() => {
    let animationId;

    const updateParticles = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + Math.cos(p.angle) * p.speed,
            y: p.y + Math.sin(p.angle) * p.speed,
            life: p.life - 0.02,
          }))
          .filter((p) => p.life > 0)
      );
      animationId = requestAnimationFrame(updateParticles);
    };

    animationId = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Track mouse movement within container
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      spawnParticle(e.clientX - rect.left, e.clientY - rect.top);
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [containerRef]);

  return particles;
}

/* ----------------------------------------------------------------------------
   3) CONTACT COMPONENT
   The primary exported component with the main UI, form, 
   background, and special effects.
------------------------------------------------------------------------------*/
export default function Contact() {
  const containerRef = useRef(null);
  const formRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 2a) Use the custom hook for particles
  const particles = useParticles(containerRef);

  // 2b) Update mousePosition for the radial glow on pointer move
  useEffect(() => {
    const handleMousePos = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    const container = containerRef.current;
    container.addEventListener('mousemove', handleMousePos);

    return () => container.removeEventListener('mousemove', handleMousePos);
  }, []);

  // Simulate form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Animate inputs when focused/blurred
  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
    },
    blur: {
      scale: 1,
      boxShadow: 'none',
    },
  };

  // Contact items & social links data
  const contactItems = [
    {
      icon: <FaEnvelope className="text-2xl" />,
      text: 'omaraflah9988@gmail.com',
      href: 'mailto:omaraflah9988@gmail.com',
    },
    {
      icon: <FaPhone className="text-2xl" />,
      text: '+968 91276869',
      href: 'tel:+96891276869',
    },
  ];

  const socialLinks = [
    { icon: <FaLinkedin className="text-xl" />, href: '#linkedin' },
    { icon: <FaInstagram className="text-xl" />, href: '#instagram' },
  ];

  // Form fields
  const formFields = [
    { label: 'Name', placeholder: 'Name', isTextArea: false },
    { label: 'Email', placeholder: 'Email', isTextArea: false },
    { label: 'Message', placeholder: 'Message', isTextArea: true },
  ];

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen  overflow-hidden perspective-1000"
    >
      {/* 2) Particle Sprites */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
            backgroundColor: p.color,
            opacity: p.life,
            filter: 'blur(1px)',
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      ))}

      {/* 3) Radial Glow for the cursor */}
      <motion.div
        className="pointer-events-none absolute w-64 h-64 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%)',
          x: mousePosition.x - 128,
          y: mousePosition.y - 128,
        }}
      />

      {/* 4) Main Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl mx-auto"
        >
          {/* Outer glowing frame */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000" />

            {/* Glassy Card Container */}
            <div className="relative bg-gray-900/90 backdrop-blur-xl p-8 rounded-xl border border-cyan-400/30">
              
              {/* 4a) Contact Info Cards (Centered Layout) */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {contactItems.map((item, idx) => (
                  <motion.a
                    key={idx}
                    href={item.href}
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    className="group relative p-6 
                      bg-gradient-to-br from-gray-800/50 to-gray-900/50 
                      rounded-lg border border-cyan-400/20 
                      hover:border-cyan-400/50 
                      transition-all duration-300
                      flex flex-col items-center text-center gap-2"
                  >
                    <span className="text-cyan-400 group-hover:animate-pulse">
                      {item.icon}
                    </span>
                    <span className="text-cyan-100 font-mono text-lg">
                      {item.text}
                    </span>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.a>
                ))}
              </div>

              {/* 4b) Contact Form */}
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                {formFields.map(({ label, placeholder, isTextArea }) => (
                  <motion.div
                    key={label}
                    variants={inputVariants}
                    animate={focusedInput === label ? 'focus' : 'blur'}
                    className="relative group"
                  >
                    {isTextArea ? (
                      <textarea
                        required
                        disabled={isSubmitting}
                        onFocus={() => setFocusedInput(label)}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full px-6 py-4 h-32 bg-gray-800/30 backdrop-blur-sm rounded-lg text-cyan-100 placeholder-gray-500 border-2 border-transparent focus:border-cyan-400/50 transition-all duration-300 resize-none"
                        placeholder={placeholder}
                      />
                    ) : (
                      <input
                        type={label === 'Email' ? 'email' : 'text'}
                        required
                        disabled={isSubmitting}
                        onFocus={() => setFocusedInput(label)}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full px-6 py-4 h-14 bg-gray-800/30 backdrop-blur-sm rounded-lg text-cyan-100 placeholder-gray-500 border-2 border-transparent focus:border-cyan-400/50 transition-all duration-300"
                        placeholder={placeholder}
                      />
                    )}

                    {/* Animated bottom border */}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-500 group-hover:w-full" />
                  </motion.div>
                ))}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  className={`w-full py-4 px-6 font-bold text-lg rounded-lg transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gradient-to-r from-cyan-400/50 to-blue-500/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400'
                  }`}
                >
                  <span className="flex items-center justify-center gap-3">
                    <FaRocket
                      className={`${isSubmitting ? 'animate-spin' : 'animate-pulse'}`}
                    />
                    {isSubmitting
                      ? 'INITIATING TRANSMISSION...'
                      : 'ESTABLISH CONNECTION'}
                  </span>
                </motion.button>
              </form>

              {/* 4c) Success Message */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-8 p-6 bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/40 rounded-lg text-center"
                  >
                    <span
                      className="text-xl font-bold text-green-300 glitch"
                      data-text="TRANSMISSION SUCCESSFUL"
                    >
                      TRANSMISSION SUCCESSFUL
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 4d) Social Links */}
              <div className="flex justify-center gap-8 mt-12">
                {socialLinks.map(({ icon, href }, idx) => (
                  <motion.a
                    key={idx}
                    href={href}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-2 border-cyan-400/30 hover:border-cyan-400 text-cyan-400 transition-all duration-300"
                  >
                    {icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Global Animations & Glitch CSS */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        /* Glitch effect */
        .glitch {
          position: relative;
          animation: glitch 2s infinite;
        }
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .glitch::before {
          left: 2px;
          text-shadow: -2px 0 #ff00c1;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          animation: glitch-anim 2s infinite linear alternate-reverse;
        }
        .glitch::after {
          left: -2px;
          text-shadow: 2px 0 #00fff9;
          clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
          animation: glitch-anim-2 2s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim {
          0% {
            clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          }
          100% {
            clip-path: polygon(0 15%, 100% 15%, 100% 60%, 0 60%);
          }
        }
        @keyframes glitch-anim-2 {
          0% {
            clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
          }
          100% {
            clip-path: polygon(0 40%, 100% 40%, 100% 85%, 0 85%);
          }
        }
      `}</style>
    </div>
  );
}
