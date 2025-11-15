// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // 'content' tells Tailwind to scan all your files in the 'src' folder
  // for class names like "flex", "p-4", "bg-red-500", etc.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This scans every .js and .jsx file in /src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};