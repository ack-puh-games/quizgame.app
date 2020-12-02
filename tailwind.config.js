module.exports = {
  purge: ['./public/index.html', './src/**/*.tsx', './src/**/*.ts'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      ringWidth: ['focus'],
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
