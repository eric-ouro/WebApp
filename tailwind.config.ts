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
          DEFAULT: '#FF7B7B',  // Original color adjusted with 10% more tan
          darker: '#C35757',   // 30% darker color adjusted with 10% more tan
          lighter: '#FFAEAE',  // 25% lighter color adjusted with 10% more tan
        },
        'custom-blue': {
          DEFAULT: '#7B77FF',  // Original color adjusted with 10% more tan
          darker: '#5753C3',   // 30% darker color adjusted with 10% more tan
          lighter: '#AEABFF',  // 25% lighter color adjusted with 10% more tan
        },
        'custom-brown': {
          DEFAULT: '#BC937A',  // New default color adjusted with 10% more tan
          darker: '#856B4F',   // 30% darker color adjusted with 10% more tan
          lighter: '#E1B895',  // 25% lighter color adjusted with 10% more tan
        },
        'custom-yellow': {
          DEFAULT: '#FDCB0A',  // Original color
          darker: '#B58E08',   // 30% darker color
          lighter: '#FDE68A',  // 25% lighter color
        },
        'custom-sky': {
          DEFAULT: '#90E4FA',  // Original color adjusted with 10% more tan
          darker: '#6996C3',   // 30% darker color adjusted with 10% more tan
          lighter: '#B3F3FD',  // 25% lighter color adjusted with 10% more tan
        },
        'custom-orange': {
          DEFAULT: '#FFC310',  // Original color adjusted with 10% more tan
          darker: '#C38C10',   // 30% darker color adjusted with 10% more tan
          lighter: '#FFD95D',  // 25% lighter color adjusted with 10% more tan
        },
        'custom-pink': {
          DEFAULT: '#EE92F0',  // Original color adjusted with 10% more tan
          darker: '#AA6BA6',   // 30% darker color adjusted with 10% more tan
          lighter: '#F8B3F9',  // 25% lighter color adjusted with 10% more tan
        },
        'custom-green': {
          DEFAULT: '#5CBF61',  // Original color adjusted with 10% more tan
          darker: '#447146',   // 30% darker color adjusted with 10% more tan
          lighter: '#89E18D',  // 25% lighter color adjusted with 10% more tan
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
        'custom-light-tan':{
          DEFAULT: '#FFFCF2;'
        },
        'custom-bright-tan':{
          DEFAULT: '#FDD01E',
        }
        
      },
      
    },
  },
  plugins: [
  ],
};
