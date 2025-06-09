import * as MUITab from "@mui/material/Tab";
import * as MUITabContext from "@mui/lab/TabContext";
import * as MUITabList from "@mui/lab/TabList";
import * as MUITabPanel from "@mui/lab/TabPanel";
import COLORS from "../../theme/Colors";
import { fontSize, margin, maxWidth, styled, textAlign } from "@mui/system";
import { createContext, useContext } from "react";

const TabContext = MUITabContext.default;

interface TabSettingsContextType {
  isStyle?: boolean;
  navbarTab?: boolean;
}
const TabSettingsContext = createContext<TabSettingsContextType>({
  isStyle: false,
  navbarTab: false,
});

const useTabSettings = () => useContext(TabSettingsContext);

type TabListProps = MUITabList.TabListProps & {
  isStyle?: boolean;
  navbarTab?: boolean;
  justify?: string;
  selectedColor?: string;
  indicatorDisplay?: "block" | "none";

};

const TabList = styled(MUITabList.default, {
  shouldForwardProp: (prop) =>
    prop !== "isStyle" && prop !== "navbarTab" && prop !== "justify" && prop !== "indicatorDisplay",
})<TabListProps>(({ navbarTab, isStyle, justify, indicatorDisplay = "none", ...props }) => ({
  position: "absolute",
  display: "flex",
  alignItems: "center",
  maxWidth: "100%",
  width: "100%",
  overflowX: "auto",
  border: 0,
  zIndex: 5,
  paddingLeft: isStyle ? 0 : 10,
  paddingRight: isStyle ? 0 : 10,
  paddingBottom: isStyle ? 0 : 0,
  backgroundColor: "transparent",
  scrollbarWidth: "none",
  WebkitJustifyContent: "space-between",
  minHeight: "auto",
  justifyContent: justify || "space-between",
  "& .MuiTabs-indicator": {
    display: indicatorDisplay,
    color: props.selectedColor || COLORS.info,
    height: `1.3px`,
    backgroundColor: props.selectedColor || COLORS.info,
    transition: "0.4s",
    borderRadius: "25px",
    marginBottom: 3,
  },
  "& .MuiTabs-scroller": {
    borderBottom: isStyle ? 0 : 0,
    "& .MuiTabs-flexContainer": {
      justifyContent: justify || "space-between",
      gap: "8px",
    },
  },
}));

const TabPanel = styled(MUITabPanel.default)(() => ({
  padding: 0,
}));


const TabTrigger = styled(MUITab.default, {
  shouldForwardProp: (prop) =>
    prop !== "isStyle" && prop !== "navbarTab" && prop !== "selectedColor" && prop !== "justify",
})<{
  isStyle: boolean;
  navbarTab: boolean;
  selectedColor?: string;
  justify?: "flex-start" | "center" | "flex-end";
}>(({ isStyle, navbarTab, selectedColor, justify, theme }) => ({
  cursor: "pointer",
  marginRight: isStyle ? 0 : navbarTab ? 0 : "30px",
  [theme.breakpoints.down("md")]: {
    marginRight: isStyle ? 0 : "5px",
  },
  marginBottom: 4,
  textTransform: "none",
  whiteSpace: "pre",
  width: isStyle ? "100%" : "fit-content",
  minWidth: "fit-content",
  maxWidth: "none",
  minHeight: "20px",
  border: isStyle ? "0" : "0",
  textAlign: "center",
  padding: isStyle ? "6px 0px" : "0px",
  height: 30,
  fontSize: 14,
  background: "transparent",
  fontWeight: 400,
  color: "inherit",
  letterSpacing: 0,
  fontFamily: "inherit",
  flexShrink: "initial",
  display: "flex",
  justifyContent: justify || "center",
  alignItems: "center",
  "&.Mui-selected": {
    fontWeight: 400,
    fontSize: 15,
    color: selectedColor || COLORS.blue6,
  },
}));

type TabProps = Omit<React.ComponentProps<typeof TabTrigger>, "isStyle" | "navbarTab"> & {
  selectedColor?: string;
  justify?: "flex-start" | "center" | "flex-end";
};

const Tab = (props: TabProps) => {
  const { isStyle = false, navbarTab = false } = useTabSettings();
  return (
    <TabTrigger
      disableRipple
      isStyle={isStyle}
      navbarTab={navbarTab}
      {...props}
    />
  );
};

const CustomTabList = ({
  children,
  isStyle = false,
  navbarTab = false,
  justify,
  ...props
}: TabListProps) => {
  return (
    <TabSettingsContext.Provider value={{ isStyle, navbarTab }}>
      <TabList
        navbarTab={navbarTab}
        variant="scrollable"
        scrollButtons={false}
        isStyle={isStyle}
        {...props}
      >
        {children}
      </TabList>
    </TabSettingsContext.Provider>
  );
};

export {
  TabContext,
  CustomTabList as TabList,
  TabPanel,
  Tab,
  type TabListProps,
  type TabProps,
};
