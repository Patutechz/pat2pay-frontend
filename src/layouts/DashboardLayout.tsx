import * as React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useThemeMode } from "../ThemeContext";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import ProfilePic from "../assets/img/avatar.png";
import {
  DarkModeOutlined,
  LightModeOutlined,
  Logout,
  MenuOpenOutlined,
  MenuOutlined,
  DashboardOutlined,
  WalletOutlined,
  MonetizationOnOutlined,
  CreditCardOutlined,
  AccountBalanceOutlined,
  PersonOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Chip,
} from "@mui/material";

const NAV = [
  { label: "Dashboard", path: "/", icon: <DashboardOutlined /> },
  { label: "Wallet", path: "/wallet", icon: <WalletOutlined /> },
  {
    label: "Investments",
    path: "/investments",
    icon: <MonetizationOnOutlined />,
  },
  { label: "Loans", path: "/loans", icon: <AccountBalanceOutlined /> },
  { label: "Cards", path: "/cards", icon: <CreditCardOutlined /> },
  { label: "Profile", path: "/profile", icon: <PersonOutlined /> },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { mode, toggleTheme } = useThemeMode();
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleChange = (_: React.SyntheticEvent, newValue: string) =>
    navigate(newValue);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          elevation={0}
          position="static"
          sx={{ bgcolor: "background.default", color: "text.secondary" }}
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 0, display: { xs: "flex", md: "flex" } }}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <MenuOpenOutlined /> : <MenuOutlined />}
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                fontFamily: "monospace",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Pat2
              <Typography color="primary" variant="inherit" component="span">
                Pay
              </Typography>
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {user && (
                <Chip
                  label={fmt(user.walletBalance)}
                  size="small"
                  sx={{
                    bgcolor: "primary.main",
                    color: "#fff",
                    fontWeight: 600,
                    display: { xs: "none", sm: "flex" },
                  }}
                />
              )}
              <IconButton onClick={toggleTheme} color="inherit">
                {mode === "light" ? (
                  <DarkModeOutlined />
                ) : (
                  <LightModeOutlined />
                )}
              </IconButton>
              <IconButton
                sx={{ p: 0 }}
                onClick={(e) => setAnchorElUser(e.currentTarget)}
              >
                <Avatar
                  alt="Profile"
                  src={ProfilePic}
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
            </Box>
          </Toolbar>
          <Menu
            sx={{ mt: "45px" }}
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(anchorElUser)}
            onClose={() => setAnchorElUser(null)}
          >
            <MenuItem
              component={Link}
              to="/profile"
              onClick={() => setAnchorElUser(null)}
            >
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
          </Menu>
        </AppBar>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4, pb: 10 }}>
        {children}
      </Container>

      {/* Mobile bottom nav */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: { xs: "block", md: "none" },
        }}
      >
        <BottomNavigation
          value={location.pathname}
          onChange={handleChange}
          showLabels
        >
          <BottomNavigationAction
            value="/"
            label="Dashboard"
            icon={<DashboardOutlined />}
          />
          <BottomNavigationAction
            value="/wallet"
            label="Wallet"
            icon={<WalletOutlined />}
          />
          {/* <BottomNavigationAction
            value="/investments"
            label="Invest"
            icon={<MonetizationOnOutlined />}
          />
          <BottomNavigationAction
            value="/loans"
            label="Loans"
            icon={<AccountBalanceOutlined />}
          /> */}
          <BottomNavigationAction
            value="/cards"
            label="Cards"
            icon={<CreditCardOutlined />}
          />

          <BottomNavigationAction
            value="/profile"
            label="Profile"
            icon={<PersonOutlined />}
          />
        </BottomNavigation>
      </Box>

      {/* Desktop drawer */}
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{ width: 260 }}
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6" fontWeight={700} fontFamily="monospace">
              Pat2
              <Typography color="primary" variant="inherit" component="span">
                Pay
              </Typography>
            </Typography>
          </Box>
          <List>
            {NAV.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default DashboardLayout;
