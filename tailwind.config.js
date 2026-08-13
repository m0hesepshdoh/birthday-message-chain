/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#CF0820',
        'primary-dark': '#9d0618',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
        comic: ['Comic Neue', 'cursive'],
        myfont: ['MyFont', 'Comic Neue', 'cursive'],
        myfont2: ['MyFont2', 'Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
