import LoadingButton from "@mui/lab/LoadingButton";
import { Button } from "@mui/material";
import React from "react";
import { hexToRgbA } from "../../app/utility/misc.helpers";

type size = "small" | "medium" | "large";
type varient = "text" | "outlined" | "contained";
type color =
  | "inherit"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning";

interface submitButtonProps {
  style?: React.CSSProperties;
  varient: varient;
  color: color;
  disable?: boolean;
  classname?: string;
  isLoading?: boolean;
  Icon?: any;
  cta: string;
  size?: size;
  fullWidth?: boolean;
  type?: "submit" | "reset" | "button";
  handlclick?: (e: any) => void;
  hoverColor?: string;
  needBorder?: boolean;
}

function SubmitBtn({
  style,
  varient,
  color,
  disable,
  classname,
  isLoading,
  Icon,
  cta,
  size,
  fullWidth,
  type = "submit",
  handlclick,
  hoverColor = "#282828",
  needBorder = false,
}: submitButtonProps) {
  return (
    <>
      {isLoading ? (
        <LoadingButton
          fullWidth={fullWidth}
          loading
          loadingPosition="center"
          variant={varient}
          className={classname}
          style={style}
          size={size}
        >
          <span style={{ marginLeft: "15px" }}> {cta}</span>
        </LoadingButton>
      ) : (
        <Button
          fullWidth={fullWidth}
          startIcon={Icon && Icon}
          className={classname}
          sx={{
            borderWidth: needBorder ? "1px !important" : "0px !important",
            ":hover": {
              backgroundColor: `${hexToRgbA(hoverColor, 1)} !important`,
            },
          }}
          style={style}
          variant={varient}
          color={color}
          size={size}
          type={type}
          onClick={handlclick}
          disabled={disable}
        >
          {cta}
        </Button>
      )}
    </>
  );
}

export default SubmitBtn;
