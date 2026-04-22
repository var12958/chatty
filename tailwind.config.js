module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in',
        'spin': 'spin 1s linear infinite',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(10px)',
      }
    },
  },
  plugins: [],
}
