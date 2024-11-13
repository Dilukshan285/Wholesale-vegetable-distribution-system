/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js", // Include Flowbite for additional components
  ],
  theme: {
    extend: {
      boxShadow: {
        'light-green': '0 2px 10px rgba(0, 255, 0, 0.3)', // Light green shadow
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        spinOnce: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideIn: 'slideIn 0.5s ease-out',
        'spin-once': 'spinOnce 3s linear 1',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'), // Include Flowbite plugin for additional functionality
  ],
};
