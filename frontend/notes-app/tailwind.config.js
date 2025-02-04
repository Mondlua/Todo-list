/** @type {import('tailwindcss').Config} */

export default {
    content:['.index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme:{
        extend: {
            // Colores
            colors:{
                primary: '#4f39f6',
                secondary: '#FFFFFF',
            },
        },
    },
    plugins: [],
};