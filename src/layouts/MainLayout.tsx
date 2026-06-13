import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useThemeMode } from "../ThemeContext";
import {
  DarkModeOutlined,
  LightModeOutlined,
  AccountBalanceWalletOutlined,
} from "@mui/icons-material";
import type { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { mode, toggleTheme } = useThemeMode();
  return (
    <>
      <AppBar
        elevation={0}
        position="sticky"
        sx={{ bgcolor: "background.default", color: "text.secondary" }}
      >
        <Toolbar>
          <AccountBalanceWalletOutlined sx={{ color: "primary.main", mr: 1 }} />
          <Typography
            variant="h6"
            fontWeight={700}
            fontFamily="monospace"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, color: "inherit", textDecoration: "none" }}
          >
            Pat2
            <Typography color="primary" variant="inherit" component="span">
              Pay
            </Typography>
          </Typography>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === "light" ? <DarkModeOutlined /> : <LightModeOutlined />}
          </IconButton>
          <Button
            component={Link}
            to="/login"
            sx={{ textTransform: "none", color: "text.secondary" }}
          >
            Login
          </Button>
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            sx={{ textTransform: "none", ml: 1 }}
          >
            Register
          </Button>
        </Toolbar>
      </AppBar>
      {children}
    </>
  );
};

export default MainLayout;
