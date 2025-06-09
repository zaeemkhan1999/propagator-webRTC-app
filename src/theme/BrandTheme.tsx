import { createTheme } from "@mui/material/styles";

interface Color {
  400: string;
  600: string;
  900: string;
}
interface Elevation {
  0: string;
  1: string;
  2: string;
}

export const theme = createTheme({
  components: {
    MuiSkeleton: {
      styleOverrides: {
        root: {
          background: "var(--background)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.MuiButton-sizeSmall": {
            height: "36px !important",
          },
          "&.MuiButton-contained": {
            // borderRadius: 6,
            fontWeight: 500,
            height: "38px",
            fontSize: "16px",
            textTransform: "none",
            paddingLeft: "16px",
            paddingRight: "16px",
            borderRadius: "4px",
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: "rgb(116, 116, 116)",
            color: "#ffffff",
          },
          "&.MuiButton-outlined": {
            // borderRadius: 6,
            fontWeight: 500,
            height: "38px",
            fontSize: "16px",
            textTransform: "none",
            paddingLeft: "16px",
            paddingRight: "16px",
            borderRadius: "4px",
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: "rgb(116, 116, 116)",
            color: "rgb(116, 116, 116)",
          },
          "&.MuiButton-text ": {
            fontWeight: 500,
            // borderRadius: 6,
            height: "38px",
            fontSize: "16px",
            textTransform: "none",
            paddingLeft: "16px",
            paddingRight: "16px",
            borderRadius: "4px",
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: "rgb(116, 116, 116)",
            color: "rgb(116, 116, 116)",
          },
          "&.Mui-disabled": {
            background: "#f6f6f6",
            color: "var(--gray)",
          },
          "&.MuiButton-textSecondary": {
            // borderRadius: 6,
            color: "rgb(116, 116, 116)",
            fontWeight: 500,
            height: "38px",
            fontSize: "16px",
          },
        },
      },
    },
    // MuiFormControlLabel: {
    //   styleOverrides: {
    //     root: {
    //       color: "#404965",
    //     },
    //     label: {
    //       fontSize: "14px",
    //       fontWeight: 500,
    //     },
    //   },
    // },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "#F6F6F6",
          color: "#404965",
          borderRadius: 4,
          ".MuiChip-deleteIcon": {
            color: "#7c8dc1",
          },
          ".MuiChip-deleteIcon:hover": {
            color: "#576694",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "var(--dark-gray)",
        },
        indeterminate: {
          color: "var(--gray) !important",
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: "var(--black-2)",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#576694",
          fontSize: "14px",
          fontWeight: 500,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          borderColor: "#2f2f2f",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--gray)",
        },
      },
    },
  },
  palette: {
    primary: {
      light: "#7785e8",
      main: "#282828",
      dark: "#2b43d1",
      contrastText: "#fff",
    },
    success: {
      light: "#52b996",
      main: "#0b9a6e",
      dark: "#006d48",
      contrastText: "#fff",
    },
    secondary: {
      light: "#6B95EC",
      main: "#3268B9",
      dark: "#003E88",
      contrastText: "#fff",
    },
    action: {
      active: "rgba(89,91,94, 0.54)",
      hover: "rgba(89,91,94, 0.08)",
      hoverOpacity: 0.08,
      selected: "rgba(89,91,94, 0.14)",
      disabled: "rgba(89,91,94, 0.26)",
      disabledBackground: "rgba(89,91,94, 0.12)",
    },
    error: {
      light: "#FFA4A1",
      main: "#e34f2f",
      dark: "#bc452d",
      contrastText: "#fff",
    },
    info: {
      light: "#7785e8",
      main: "#5567E3",
      dark: "#304cdc",
      contrastText: "#fff",
    },
  },
  shadows: [
    "none", // Elevation 0
    "0 2px 5px 0 rgb(60 66 87 / 12%), 0 1px 1px 0 rgb(0 0 0 / 12%);",
    // "rgb(208, 209, 220) 1px 1px 4px",
    // "0 0 1px 0 rgba(9,30,66,0.31), 0 4px 8px -2px rgba(9,30,66,0.25)", // Elevation 1
    "0px 1px 5px 0px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 3px 1px -2px rgba(0,0,0,0.12)", // Elevation 2
    "0px 1px 8px 0px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 3px 3px -2px rgba(0,0,0,0.12)", // Elevation 3
    "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)", // Elevation 4
    "0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)", // Elevation 5
    "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)", // Elevation 6
    "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)", // Elevation 7
    "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)", // Elevation 8
    "0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)", // Elevation 9
    "0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)", // Elevation 10
    "0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)", // Elevation 11
    "0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)", // Elevation 12
    "0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)", // Elevation 13
    "0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)", // Elevation 14
    "0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)", // Elevation 15
    "0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)", // Elevation 16
    "0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)", // Elevation 17
    "0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)", // Elevation 18
    "0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)", // Elevation 19
    "0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)", // Elevation 20
    "0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)", // Elevation 21
    "0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)", // Elevation 22
    "0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)", // Elevation 23
    "0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)", // Elevation 24
  ],
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h6: {
      fontWeight: 600,
    },
  },
});

export const green: Color = {
  400: "#3bae8b",
  600: "#0b9a6f",
  900: "#076b4d",
};

export const yellow: Color = {
  400: "#FFEB75",
  600: "#FFB844",
  900: "#C88906",
};

export const gray: Color = {
  400: "#C7D4E7",
  600: "#96A3B5",
  900: "#687485",
};

export const white: Color = {
  400: "#fff",
  600: "#",
  900: "#E3E7EF",
};

export const red: Color = {
  400: "#FFA4A1",
  600: "#e34f2f",
  900: "#bc452d",
};

export const PrimaryColor: Color = {
  400: "#9a70ec",
  600: "#5567E3",
  900: "#662ae1",
};

export const elevation: Elevation = {
  0: "#",
  1: "",
  2: "rgba(0, 0, 0, 0.08) 0px 2px 10px 0px, rgba(0, 0, 0, 0.12) 0px 2px 4px 0px",
};

export const black: Color = {
  400: "#455571",
  600: "#172B4E",
  900: "#101E36",
};
