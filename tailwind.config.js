module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'google-button-grey': '808485',
      },
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '20%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
          '40%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
          '80%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
          '100%': {
            opacity: '0.5',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'fade-in-down': 'fade-in-down 5s ease-out',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
