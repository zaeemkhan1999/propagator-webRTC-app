const COLORS = {
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
  black1: "#282828",
  black2: "#4F4F4F",
  black3: "#243859",
  black4: "#181C1C",
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
  joinus: "#DE6879",
  pink: "#DE495E",
};

export const getPaletteColorsForMui = () => {
  const palette: any = {};

  Object.keys(COLORS).forEach((key) => {
    palette[key] = {
      main: COLORS[key as keyof typeof COLORS],
    };
  });

  return palette;
};

export default COLORS;
