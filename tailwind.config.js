const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  purge: isProd ? ['./src/**/*.{js,ts,jsx,tsx}'] : undefined,
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
