import React from 'react'
import { motion } from 'framer-motion'

const AnimatedSection = ({ children, className }) => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8 }}
    className={className}
  >
    {children}
  </motion.section>
)

export default AnimatedSection