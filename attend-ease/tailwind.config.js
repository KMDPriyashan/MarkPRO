/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0f2747',
        ink: '#172b4d',
        mist: '#f4f7fb',
      },
    },
  },
  plugins: [],
}
