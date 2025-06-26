/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        bungee: ['var(--font-bungee)', 'cursive'],
      },
      colors: {
        primary: '#830016',
        secondary: '#EFE8DD', // Yellow
        accent: '#EF4444', // Red
        background: '#F3F4F6', // Gray
        text: '#1D1E1C', // Dark Gray
      },
    },
  },
  plugins: [],
};
