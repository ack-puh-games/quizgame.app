module.exports = {
  purge: {
    content: ['./public/index.html', './src/**/*.tsx', './src/**/*.ts'],
  },
  darkMode: 'media',
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      ringWidth: ['focus'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/custom-forms'),
    require('@tailwindcss/typography'),
  ],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true,
  },
};
