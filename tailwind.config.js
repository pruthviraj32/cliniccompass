/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB', // Blue - trust and calm
        secondary: '#10B981', // Green - health and safety
        danger: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
      fontSize: {
        // Larger base sizes for accessibility
        'base': '18px',
        'lg': '20px',
        'xl': '24px',
        '2xl': '28px',
        '3xl': '32px',
        '4xl': '40px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

