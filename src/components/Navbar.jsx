import React, { memo, useState, useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue, useScroll } from 'framer-motion';
import { Link } from 'react-scroll';
import { Sparkles, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './LanguageToggle';

/**
 * Updated mouse position hook using separate MotionValues for x and y.
 */
const useMousePosition = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  useEffect(() => {
    let timeoutId;
    
    const handleMouseMove = (e) => {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          x.set(e.clientX);
          y.set(e.clientY);
          timeoutId = null;
        }, 16); // ~60fps
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [x, y]);
  
  return { x, y };
};

/**
 * Interactive Aurora Effect that subtly follows the mouse.
 */
const InteractiveAuroraEffect = memo(() => {
  const mousePos = useMousePosition();
  // Adjust the range based on your viewport or desired effect.
  const offsetX = useTransform(mousePos.x, [0, 1920], [-50, 50]);
  const offsetY = useTransform(mousePos.y, [0, 1080], [-50, 50]);

  return (
    <motion.div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-neon-teal/20 via-stellar-purple/10 to-transparent blur-3xl"
        style={{ x: offsetX, y: offsetY }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-bl from-stellar-purple/20 via-neon-teal/10 to-transparent blur-3xl"
        style={{ x: offsetX, y: offsetY }}
      />
    </motion.div>
  );
});
InteractiveAuroraEffect.displayName = 'InteractiveAuroraEffect';

/**
 * Enhanced NavLink with interactive hover effects.
 */
const NavLink = memo(({ id, label, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, boxShadow: '0px 4px 10px rgba(0,0,0,0.2)' }}
      className="relative px-4 py-2 cursor-pointer"
      onClick={onClick}
    >
      <Link
        to={id}
        spy={true}
        smooth={true}
        offset={-80}
        duration={500}
        className={`
          relative z-10 font-space-grotesk text-lg tracking-wide
          ${isActive ? 'text-neon-teal' : 'text-stellar-white/90'}
          transition-colors duration-200
        `}
      >
        {label}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-neon-teal to-stellar-purple origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isActive || isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </Link>
    </motion.div>
  );
});
NavLink.displayName = 'NavLink';

/**
 * Enhanced Logo with interactive animations.
 */
const Logo = memo(() => {
  const rotation = useSpring(0, { stiffness: 100, damping: 10 });
  
  return (
    <motion.div
      className="flex items-center gap-3 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => rotation.set(360)}
      onHoverEnd={() => rotation.set(0)}
    >
      <motion.div style={{ rotate: rotation }}>
        <Sparkles className="text-neon-teal w-8 h-8" />
      </motion.div>
      
      <span className="text-white font-space-mono text-xl tracking-wider transition-all duration-300">
        COSMIC
        <span className="bg-gradient-to-r from-neon-teal to-stellar-purple bg-clip-text text-transparent">
          {" "}PORTAL
        </span>
      </span>
    </motion.div>
  );
});
Logo.displayName = 'Logo';

/**
 * Main Navbar component with interactive features.
 */
const Navbar = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  // Animate box-shadow based on scroll position.
  const boxShadow = useTransform(
    scrollY,
    [0, 100],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 12px rgba(0,0,0,0.4)"]
  );

  const navLinks = [
    { id: 'hero', label: t('nav.home') },
    { id: 'skills', label: t('nav.skills') },
    { id: 'projects', label: t('nav.portfolio') },
    { id: 'contact', label: t('nav.contact') }
  ];

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Close mobile menu when a link is clicked.
  const handleMobileNavClick = (id) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ boxShadow }}
      className="fixed top-0 w-full z-50"
    >
      {/* Backdrop and interactive aurora */}
      <div className="absolute inset-0 backdrop-blur-xl bg-space-dark/50" />
      <InteractiveAuroraEffect />
      
      {/* Scroll progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-teal via-stellar-purple to-neon-teal"
        style={{ scaleX }}
      />

      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center relative">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.id}
                {...link}
                isActive={activeSection === link.id}
                onClick={() => setActiveSection(link.id)}
              />
            ))}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-neon-teal p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>

          {/* Language Toggle */}
          <motion.div
            className="relative z-10 ml-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LanguageToggle
              className="p-3 rounded-full bg-space-dark/50 hover:bg-space-dark/80
                         transition-all duration-300 text-neon-teal hover:text-stellar-purple
                         shadow-lg shadow-neon-teal/20 hover:shadow-stellar-purple/30"
            />
          </motion.div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-space-dark/90 backdrop-blur-lg"
        >
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.id}
                {...link}
                isActive={activeSection === link.id}
                onClick={() => handleMobileNavClick(link.id)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default memo(Navbar);
