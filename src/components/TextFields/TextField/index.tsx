import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

const BootstrapTextField = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(0.5),
  },
  "&.MuiInputBase-sizeSmall": {
    height: "36px !important",
  },
  "&.MuiInputBase-root": {
    borderRadius: 6,
    border: "1px solid #ced4da",
    padding: "0px 12px",
    backgroundColor: "white",
    minHeight: "42px",
    fontSize: "14px",
    transition: theme.transitions.create([
      "outline",
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    "& input": {
      margin: 0,
      fontWeight: 400,
      padding: 0,
      color: "var(--black-1)",
      "&::placeholder": {
        textOverflow: "ellipsis !important",
        color: "#ced4da",
        opacity: 1,
      },
    },
    ".MuiInputAdornment-root": {
      p: {
        color: "var(--black-3)",
        fontSize: "14px",
        fontWeight: 400,
      },
    },
    "&.Mui-focused": {
      border: "1px solid " + theme.palette.primary.main,
    },
    "&:hover": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-error": {
      border: "1px solid " + theme.palette.error.main,
    },
    "&.Mui-disabled": {
      boxShadow: "none",
      border: "1px solid #ced4da",
      cursor: "not-allowed",
    },
  },
}));

export default BootstrapTextField;
