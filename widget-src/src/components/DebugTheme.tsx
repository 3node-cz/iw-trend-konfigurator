import React from "react";
import { useTheme } from "@mui/material/styles";

const DebugTheme: React.FC = () => {
  const theme = useTheme();

  React.useEffect(() => {
    console.log("Theme Debug Info:", {
      components: {
        MuiModal: theme.components?.MuiModal,
        MuiDialog: theme.components?.MuiDialog,
        MuiPopover: theme.components?.MuiPopover,
        MuiPopper: theme.components?.MuiPopper,
      },
      palette: {
        primary: theme.palette.primary,
        secondary: theme.palette.secondary,
      },
    });

    // More detailed component inspection
    if (theme.components?.MuiDialog) {
      console.log("MuiDialog configuration:", theme.components.MuiDialog);
    } else {
      console.log("MuiDialog configuration is missing!");
    }

    if (theme.components?.MuiModal) {
      console.log("MuiModal configuration:", theme.components.MuiModal);
    } else {
      console.log("MuiModal configuration is missing!");
    }
  }, [theme]);

  return null; // This component only logs, doesn't render anything
};

export default DebugTheme;
