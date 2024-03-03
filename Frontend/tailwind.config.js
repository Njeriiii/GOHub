/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#36B8BF',
      },
      fontFamily: {
        sans: ["Namdhinggo", 'sans-serif'], // Replace 'My Chosen Font' with your actual font name
    }
    },
  },
  plugins: [
    require('@tailwindcss/forms'), 
    // require('@tailwindcss/typography'),
  ],
}