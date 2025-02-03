module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'space-dark': '#0a0a1a',
        'neon-teal': '#39FFE2',
        'stellar-purple': '#A239EA',
        'stellar-white': '#F4F4FF',
        'purple-400': '#AB47BC',
        
      },
      fontFamily: {
        space: ['Space Mono', 'monospace'],
        'space-mono': ['Space Mono', 'monospace'],
        'space-grotesk': ['Space Grotesk', 'sans-serif']
      },
      animation: {
        'gradient-x': 'gradient-x 8s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        }
      }
    },
  },
  plugins: [],
}