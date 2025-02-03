import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { TypeAnimation } from 'react-type-animation'

const Hero = () => {
  const { t } = useTranslation()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 300], [0, 100])
  const textShadow = useTransform(scrollY, [0, 300], ['0px 0px 20px rgba(0,255,255,0.7)', '0px 0px 40px rgba(0,255,255,0.9)'])

  const floatingVariants = {
    float: {
      y: [-20, 20],
      rotateX: [0, 15, -15, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: "easeInOut"
      }
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center ">
      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: 15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1.2, type: 'spring' }}
        className="text-center space-y-8 relative z-10 px-4"
        style={{ perspective: 1000 }}
      >
        {/* 3D Name Text */}
        <motion.div 
          className="relative inline-block"
          variants={floatingVariants}
          animate="float"
          style={{ y, textShadow }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neon-teal/40 via-purple-400/20 to-neon-teal/40 blur-3xl animate-rotate-3d" />
          <div className="relative transform-style-preserve-3d">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold space-y-2">
              <span className="block bg-gradient-to-r from-neon-teal via-purple-400 to-neon-teal bg-clip-text text-transparent animate-gradient-3d">
                {t('home.firstName')}
              </span>
              <span className="block bg-gradient-to-r from-purple-400 via-neon-teal to-purple-400 bg-clip-text text-transparent animate-gradient-3d delay-1000">
                {t('home.lastName')}
              </span>
            </h1>
          </div>
        </motion.div>

        {/* Animated Typing Text */}
        <div className="min-h-[60px] md:min-h-[80px] perspective-1000">
          <motion.div
            className="transform-style-preserve-3d"
            initial={{ rotateX: 45 }}
            animate={{ rotateX: 0 }}
            transition={{ delay: 0.5 }}
          >
            <TypeAnimation
              sequence={[
                t('home.subtitle'),
                1500,
                t('home.subtitleAlt'),
                1500,
              ]}
              wrapper="div"
              speed={40}
              deletionSpeed={60}
              className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-space tracking-wide drop-shadow-3d"
              repeat={Infinity}
              cursor={false}
            />
           
          </motion.div>
        </div>

        {/* 3D Animated Button */}
        <motion.div
          whileHover={{ scale: 1.1, rotateY: 5 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block relative group"
          style={{ perspective: 1000 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neon-teal to-purple-400 rounded-full blur-xl opacity-80 group-hover:opacity-100 transition-all duration-500" />
          <motion.button 
            className="relative px-8 py-3.5 bg-space-dark/90 rounded-full border-2 border-neon-teal/50 text-neon-teal font-space hover:bg-space-dark transition-all duration-300 backdrop-blur-lg hover:border-neon-teal overflow-hidden"
            style={{ boxShadow: '0 10px 30px rgba(0,255,255,0.3)' }}
            initial={{ rotateY: 0 }}
            whileHover={{ rotateY: 10, rotateX: 5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine-3d" />
            <span className="relative bg-gradient-to-r from-neon-teal to-purple-400 bg-clip-text text-transparent text-shadow-lg">
              {t('home.cta')}
            </span>
          </motion.button>
        </motion.div>

        {/* Global 3D Styles */}
        <style jsx global>{`
          @keyframes rotate-3d {
            0% { transform: rotateX(0) rotateY(0); }
            100% { transform: rotateX(360deg) rotateY(360deg); }
          }
          
          .drop-shadow-3d {
            text-shadow: 0 0 15px rgba(0,255,255,0.7),
                         0 0 30px rgba(0,255,255,0.5),
                         0 0 45px rgba(0,255,255,0.3);
          }
          
          @keyframes shine-3d {
            0% { transform: translateX(-100%) rotateY(45deg); }
            100% { transform: translateX(100%) rotateY(45deg); }
          }
          
          .animate-shine-3d {
            animation: shine-3d 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
          
          .animate-blink-3d {
            animation: blink 1s infinite steps(1);
            box-shadow: 0 0 10px rgba(0,255,255,0.5);
          }
        `}</style>
      </motion.div>
    </section>
  )
}

export default Hero