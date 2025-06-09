/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'light-black': '2px 4px 6px rgba(0, 0, 0, 0.2)',
      },
      keyframes: {
        'slide-in': {
          '0%': { opacity: 0, transform: 'translateX(-20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.5s ease-in-out',
      },
      colors: {
        red1: "#9E1C1C",
        red2: "#E63C49",
        red3: "#EB5757",
        red4: "#EB57571C",
        black1: "#282828",
        black2: "#4F4F4F",
        black3: "#243859",
        black4: "#181C1C",
        themepink: "#DE495E",
        themeLightPink: "#DE6879",
        white: "#ffffff",
        // Theme Background
        background: "#ffffff",
        // Brand Colors
        primary: "#487A9D",
        secondary: "#F2F3F7",
        bagcomment: "#9599B326",
        // State Colors
        info: "#409FFF",
        success: "#20A144",
        warning: "#CC9E14",
        danger: "#E63C49",
        // Black Colors
        white: "#ffffff",
        coloricon: "#9b9fb7",
        red2: "#E63C49",
        red3: "#EB5757",
        red4: "#EB57571C",
        yellow: "#E2B93B",
        greyrejected: "#E0E0E0",
        green3: "#27AE601D",
        // Gray Colors
        grey21: "#8D99A81C",
        grey22: "#6B7076",
        grey1: "#8E8E8E",
        grey2: "#666666",
        grey3: "#EFEFEF",
        grey4: "#707070",
        grey5: "#F2F3F7",
        grey6: "#25283124",
        grey7: "#2528310a",
        grey8: "#E4E4E4",
        grey9: "#AEAEAE",
        grey10: "#D3D3D3",
        grey11: "#F8F8F8",
        grey12: "#909090",
        grey13: "#F9F9F9",
        grey14: "#BBB7B7",
        grey15: "#E0E0E0",
        grey16: "#F1F0F2",
        grey17: "#767066",
        grey18: "#EBE0CD",
        grey19: "#949698",
        grey23: "#f2f2f2",
        blue1: "#2F80ED",
        blue2: "#9599B3",
        blue3: "#9599b338",
        blue4: "#e3efff",
        blue5: "#007AFF",
        blue6: "#2f80ec",
        blue7: "#0066ff",
        red1: "#9E1C1C",
        green1: "#27AE60",
        green2: "#449448",
        green4: "#328800",
        orange1: "#ED8B34",
        hoverbtn: "#771515",
        imagecolor: "#1233",
        greenhover: "#357538",
        oposity: "#1d1d1d61",
        grey20: "#999999",
        landingHeader: "#747474",
        landingTel: "#E5E5E5",
      },
      transitionDuration: {
        fast: '75ms',
      },
      boxShadow: {
        shadowImg: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        cardShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px"
      },
      animation: {
        like: 'likeAnimation 0.3s ease-out',
      },
      keyframes: {
        likeAnimation: {
          '0%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(1.3)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
}

