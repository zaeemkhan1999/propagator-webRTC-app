import { createRoot } from "react-dom/client";
import "./index.css";
import Entry from "./App.tsx";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { theme as brandThemeSchema } from "./theme/BrandTheme.tsx";

createRoot(document.getElementById("root")!).render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={brandThemeSchema}>
      <Entry />
    </ThemeProvider>
  </StyledEngineProvider>,
);
