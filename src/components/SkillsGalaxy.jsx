import React, { useState, useMemo, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Lucide-react icons that actually exist
import { 
  Code, 
  Database, 
  Cpu, 
  Hash, 
  Layout, 
  Palette,
  Coffee,
  Github,
  Server,
  Globe,
  Brain,
  BarChart,
  FileJson,
} from 'lucide-react';

// React Icons (FontAwesome / Simple Icons, etc.)
import { FaReact, FaNode } from 'react-icons/fa';
import { 
  SiTensorflow, 
  SiScikitlearn, 
  SiDart, 
  SiDjango, 
  SiPostman, 
  SiDocker as Docker,
  SiFlask as Flask,
  SiSpring as FaSpring
} from 'react-icons/si';

// === Skill Data ===
const skills = [
  { 
    name: 'Python',
    icon: <Code className="w-8 h-8" />,
    color: 'rgb(75, 139, 190)',
    description: 'Advanced Python Development',
    category: 'Languages'
  },
  { 
    name: 'Java',
    icon: <Coffee className="w-8 h-8" />,
    color: 'rgb(255, 69, 0)',
    description: 'Enterprise Java Applications',
    category: 'Languages'
  },
  { 
    name: 'HTML',
    icon: <Layout className="w-8 h-8" />,
    color: 'rgb(240, 101, 41)',
    description: 'Semantic HTML5 Markup',
    category: 'Frontend'
  },
  { 
    name: 'CSS',
    icon: <Palette className="w-8 h-8" />,
    color: 'rgb(41, 101, 241)',
    description: 'Modern CSS3 & Animations',
    category: 'Frontend'
  },
  { 
    name: 'SQL',
    icon: <Database className="w-8 h-8" />,
    color: 'rgb(0, 149, 199)',
    description: 'Database Management',
    category: 'Backend'
  },
  { 
    name: 'Tailwind',
    icon: <Hash className="w-8 h-8" />,
    color: 'rgb(56, 189, 248)',
    description: 'Tailwind CSS Framework',
    category: 'Frontend'
  },
  { 
    name: 'C++',
    icon: <Cpu className="w-8 h-8" />,
    color: 'rgb(0, 123, 131)',
    description: 'Systems Programming',
    category: 'Languages'
  },
  { 
    name: 'C#',
    icon: <Hash className="w-8 h-8" />,
    color: 'rgb(147, 51, 234)',
    description: '.NET Development',
    category: 'Languages'
  },
  { 
    name: 'React',
    icon: <FaReact className="w-8 h-8" />,
    color: 'rgb(97, 218, 251)',
    description: 'Modern React Development',
    category: 'Frontend'
  },
  { 
    name: 'GitHub',
    icon: <Github className="w-8 h-8" />,
    color: 'rgb(255, 255, 255)',
    description: 'Version Control & Collaboration',
    category: 'Tools'
  },
  { 
    name: 'Docker',
    icon: <Docker className="w-8 h-8" />,
    color: 'rgb(13, 136, 219)',
    description: 'Containerization & Deployment',
    category: 'DevOps'
  },
  {
    name: 'Flask',
    icon: <Flask className="w-8 h-8" />,
    color: 'rgb(255, 255, 255)',
    description: 'Python Web Framework',
    category: 'Backend'
  },
  {
    name: 'Django',
    icon: <SiDjango className="w-8 h-8" />,
    color: 'rgb(67, 156, 108)',
    description: 'Python Web Framework',
    category: 'Backend'
  },
  {
    name: 'Postman',
    icon: <SiPostman className="w-8 h-8" />,
    color: 'rgb(255, 108, 55)',
    description: 'API Testing & Documentation',
    category: 'Tools'
  },
  {
    name: 'Node.js',
    icon: <FaNode className="w-8 h-8" />,
    color: 'rgb(104, 160, 99)',
    description: 'JavaScript Runtime',
    category: 'Backend'
  },
  {
    name: 'Spring',
    icon: <FaSpring className="w-8 h-8" />,
    color: 'rgb(109, 179, 63)',
    description: 'Java Framework',
    category: 'Backend'
  },
  {
    name: 'TensorFlow',
    icon: <SiTensorflow className="w-8 h-8" />,
    color: 'rgb(255, 170, 50)',
    description: 'Machine Learning Framework',
    category: 'Data'
  },
  {
    name: 'scikit-learn',
    icon: <SiScikitlearn className="w-8 h-8" />,
    color: 'rgb(248, 152, 32)',
    description: 'Machine Learning Library',
    category: 'Data'
  },
  {
    name: 'Data Analysis',
    icon: <BarChart className="w-8 h-8" />,
    color: 'rgb(106, 90, 205)',
    description: 'Statistical Analysis & Visualization',
    category: 'Data'
  },
  {
    name: 'Dart',
    icon: <SiDart className="w-8 h-8" />,
    color: 'rgb(0, 180, 216)',
    description: 'Mobile Development',
    category: 'Languages'
  }
];

// Compute unique categories once
const categories = ['All', ...new Set(skills.map(skill => skill.category))];

/* --- Motion Variants --- */
const containerVariants = {
  hidden: { opacity: 0, y: 75 },
  visible: { opacity: 1, y: 0 },
};

const parentItemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      delay: i * 0.05,
    },
  }),
  exit: { opacity: 0, scale: 0.8 },
};

const skillCardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      delay: i * 0.1,
    },
  }),
};

/* --- Skill Card Component --- */
const SkillCard = memo(({ skill, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleHoverStart = useCallback(() => setIsHovered(true), []);
  const handleHoverEnd = useCallback(() => setIsHovered(false), []);

  return (
    <motion.div
      className="relative group"
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      variants={skillCardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <motion.div
        className="p-6 rounded-2xl backdrop-blur-md bg-black/30 cursor-pointer transform-gpu"
        animate={{
          scale: isHovered ? 1.05 : 1,
          boxShadow: isHovered
            ? `0 0 30px ${skill.color}`
            : `0 0 10px ${skill.color}40`,
          y: isHovered ? -10 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        <motion.div className="flex flex-col items-center">
          <motion.div
            className="mb-3"
            style={{ color: skill.color }}
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.2 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {skill.icon}
          </motion.div>
          <h3
            className="text-lg font-bold mb-2"
            style={{ color: skill.color }}
          >
            {skill.name}
          </h3>
          <AnimatePresence>
            {isHovered && (
              <motion.p
                className="text-sm text-gray-300 text-center"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {skill.description}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
});

/* --- Particle Field Component --- */
const ParticleField = memo(() => {
  // Memoize random coordinates so they are generated only once
  const particles = useMemo(
    () =>
      [...Array(100)].map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 2,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(({ id, left, top, x, y, duration, delay }) => (
        <motion.div
          key={id}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{ left, top }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 0.7, 0],
            x: [0, x],
            y: [0, y],
          }}
          transition={{
            duration,
            repeat: Infinity,
            delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
});

/* --- Main Component --- */
const SkillsGalaxy = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  // Memoize the filtered skills to avoid unnecessary computations
  const filteredSkills = useMemo(
    () =>
      selectedCategory === 'All'
        ? skills
        : skills.filter((skill) => skill.category === selectedCategory),
    [selectedCategory]
  );

  // Optionally, you could memoize the click handler (array is small so this is optional)
  const handleCategoryClick = useCallback(
    (category) => () => setSelectedCategory(category),
    []
  );

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <ParticleField />

      <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-purple-500/5 to-transparent" />

      <motion.div
        className="relative container mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h2
          className="text-4xl font-bold text-center mb-8 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Section Title Could Go Here */}
        </motion.h2>

        {/* Category Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedCategory === category
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Skill Cards */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                layout
                variants={parentItemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                custom={index}
              >
                <SkillCard skill={skill} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default SkillsGalaxy;
