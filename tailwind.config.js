const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Proxima Nova', ...defaultTheme.fontFamily.sans],
      },
    },
    screens: {
      'max-sm': {'max': '640px'},
      'max-md': {'max': '780px'},
      'minmax-sm': {'min': '640px', 'max': '767px'},
    },
    gridTemplateColumns: {
      '3s': 'minmax(0px,1fr) minmax(0px, 1fr) minmax(0px, 1fr)',
    }
  },
  plugins: [],
}