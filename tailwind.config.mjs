/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}'],
  theme: {
    extend: {
      colors: {
        pumpkin: {
          500: '#EA7A2C',
          700: '#A94A0A'
        }
      }
    }
  },
  plugins: []
};
