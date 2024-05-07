/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'selector',
    content: ["./index.html", "src/**/*.{jsx,js}", "src/**/*.{tsx,ts}"],
    theme: {
        extend: {
            colors:{
                lightbeige:'#f3ecdb',
                darkbeige:'#E8D9B8',
                lightindigo:'#c2cbce',
                darkindigo:'#86979e',
            },
        },
    },
    plugins: [],
}

