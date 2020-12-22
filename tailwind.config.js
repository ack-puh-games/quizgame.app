const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./public/index.html', './src/**/*.tsx', './src/**/*.ts'],
  darkMode: 'class',
  theme: {
    extend: {
      colors,
    },
  },
  variants: {
    extend: {
      ringWidth: ['focus'],
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
