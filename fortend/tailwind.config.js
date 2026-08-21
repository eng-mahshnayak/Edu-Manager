module.exports = {
  theme: {
    extend: {
      keyframes: {
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.4)',
            transform: 'scale(1)',
          },
          '50%': { 
            boxShadow: '0 0 20px 5px rgba(239, 68, 68, 0.6)',
            transform: 'scale(1.05)',
          },
        },
      },
      animation: {
        'pulse-glow': 'pulseGlow 1.5s ease-in-out infinite',
      },
    },
  },
};