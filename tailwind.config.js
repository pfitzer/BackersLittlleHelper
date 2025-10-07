import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx,txt}",
    ],
    theme: {
        extend: {
        },
    },
    plugins: [
        daisyui,
    ],
    daisyui: {
        themes: [
            {
                rsi: {
                    "primary": "#3b82f6",
                    "secondary": "#60a5fa",
                    "accent": "#2563eb",
                    "neutral": "#0a0e1a",
                    "base-100": "#000b11",
                    "base-200": "#020712",
                    "base-300": "#030a14",
                    "info": "#3b82f6",
                    "success": "#10b981",
                    "warning": "#f59e0b",
                    "error": "#ef4444",
                },
            },
            "dark",
        ],
    },
}