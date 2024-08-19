/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'pink': '#fab1b1',
        'baddie-dark': '#312930',
        'baddie-light-pink': '#eea6c4',
        'baddie-deep-purple': '#4d394e',
        'baddie-purple': '#6e486e',
        'baddie-deep-pink': '#b9668d'
      },
    },
  },
  plugins: [],
}

