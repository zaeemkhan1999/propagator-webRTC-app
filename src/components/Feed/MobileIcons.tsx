import { cn } from "@/helper/ui";
import { IconButton } from "@mui/material";
import { memo } from "react";

interface Props {
  icon: any;
  value?: number;
  orientation?: "vertical" | "horizontal";
  onclick?: any;
  variant?: "text-dark" | "text-white";
  setShowLikes?: any;
};

const MobileIcons = memo(({
  icon,
  value = 0,
  orientation = "horizontal",
  onclick,
  variant = "text-dark",
  setShowLikes,
}: Props) => {
  return (
    <div
      className={`${orientation === "horizontal"
        ? "flex flex-col items-center"
        : "flex items-center"
        } gap-1`}
    >
      <IconButton onClick={onclick} color="inherit">
        {icon}
      </IconButton>
      {value > 0 && (
        <span
          onClick={setShowLikes}
          className={cn(
            "text-xs shadow-light-black cursor-pointer",
            variant === "text-dark" ? "text-dark" : "text-light",
          )}
        >
          {value}
        </span>
      )}
    </div>
  );
});

export default MobileIcons;
