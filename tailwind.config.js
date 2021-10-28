module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'google-button-grey': '808485',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
