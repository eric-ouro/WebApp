/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xs: '0.625rem', // 10px
        sm: '0.75rem',  // 12px
        base: '0.875rem', // 14px
        lg: '1rem', // 16px
        xl: '1.125rem', // 18px
        '2xl': '1.25rem', // 20px
        '3xl': '1.5rem', // 24px
        '4xl': '1.75rem', // 28px
        '5xl': '2rem', // 32px
        '6xl': '2.25rem', // 36px
        '7xl': '2.5rem', // 40px
        '8xl': '2.75rem', // 44px
        '9xl': '3rem', // 48px
      },
            
      borderRadius: {
        'sm': '0.25rem',  // Change rounded-sm from 2px to 3px
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'custom-red': {
          DEFAULT: '#FF6B6B',  // Original color
          darker: '#B34747',   // 30% darker color
          lighter: '#FF9E9E',  // 25% lighter color
        },
        'custom-blue': {
          DEFAULT: '#6B67FF',
          darker: '#4743B3',
          lighter: '#9E9BFF',  // 25% lighter color
        },
        'custom-brown': {
          DEFAULT: '#ac835a',  // New default color
          darker: '#755b3f',   // 30% darker color
          lighter: '#d1a885',  // 25% lighter color
        },
        'custom-yellow': {
          DEFAULT: '#EDCF0E',
          darker: '#A5910A',
          lighter: '#F3E55F',  // 25% lighter color
        },
        'custom-sky': {
          DEFAULT: '#80D4FA',
          darker: '#5996B3',
          lighter: '#A3E3FD',  // 25% lighter color
        },
        'custom-orange': {
          DEFAULT: '#FFB300',
          darker: '#B37C00',
          lighter: '#FFC94D',  // 25% lighter color
        },
        'custom-pink': {
          DEFAULT: '#DE82E0',
          darker: '#9A5B9B',
          lighter: '#E8A3E9',  // 25% lighter color
        },
        'custom-green': {
          DEFAULT: '#4CAF51',
          darker: '#347136',
          lighter: '#79D17D',  // 25% lighter color
        },
        'custom-neutral-brown': {
          darker: '#8B7D74',
          dark: '#A19685',
          medium: '#B8A382', 
          lighter: '#D3C6BC',  // 20% lighter than dark
          lighterMedium: '#E1D1C6',  // 20% lighter than medium
        },
        'custom-neutral-green': {
          darker: '#6B8B47',  // Darker shade of light yellowy green
          dark: '#85A196',    // Dark shade of light yellowy green
          medium: '#A3B882',  // Medium shade of light yellowy green
          lighter: '#C6D3BC', // 20% lighter than dark
          lighterMedium: '#D1E1C6',  // 20% lighter than medium
        },
        
      },
      
    },
  },
  plugins: [
  ],
};
