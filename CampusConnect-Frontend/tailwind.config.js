/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#f59e0b',
        accent: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        success: '#10b981'
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}

