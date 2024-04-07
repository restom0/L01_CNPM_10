/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', 'node_modules/flowbite-react/lib/esm/**/*.js'],
  theme: {
    extend: {
      spacing: {
        '1': '8px',
        '2': '12px',
        '3': '16px',
        '4': '24px',
        '5': '32px',
        '6': '48px',
      },
      colors: {
        'mainBlue':'#0F6CBF', //Ex: For main Butoon, text
        'lightBlue':{
          300:'rgba(128, 221, 238, 1)',  // Ex: Background blue
          200:'rgba(128, 221, 238, 0.5)', // Ex: Hover on lightBlue-200
        },
        'darkBlue':'#164399', // Ex: footer
        'textGray':'#374151', // Ex:text
        'lightGray':'#f5f5f5', //Ex: Background Gray
        'mainRed':'#dc2626',  // Ex: X icon
        'lightRed':'#fee2e2', // Ex: Background of cancel button
        'mainOrange':'orange-600', //Ex warnning icon
        'blue':'#0000ff', //Ex header color
        'success': '#2E7D32', //Ex success
        'warning': '#ed6c02' //Ex warning
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
