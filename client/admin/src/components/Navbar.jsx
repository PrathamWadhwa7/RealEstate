import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  Box,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import ArticleIcon from '@mui/icons-material/Article';
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const actualIsLoggedIn = isLoggedIn ?? !!localStorage.getItem("token");

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn?.(false);
    navigate("/login");
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Properties", icon: <HomeWorkIcon />, path: "/properties" },
    { text: "Areas", icon: <LocationOnIcon />, path: "/area" },
    { text: "Leads", icon: <PeopleIcon />, path: "/leads" },
    { text: "Services", icon: <ArticleIcon />, path: "/services" },
    { text: "Blogs", icon: <ArticleIcon />, path: "/blogs" },
  ];

  const navItems = (
    <Box className="navbar-center-links">
      {actualIsLoggedIn ? (
        menuItems.map((item) => (
          <button
            key={item.text}
            onClick={() => navigate(item.path)}
            className="nav-link-button"
          >
            <Box className="nav-link-content">
              {item.icon}
              <span>{item.text}</span>
            </Box>
          </button>
        ))
      ) : (
        <Typography variant="h6" className="admin-panel-text">
          Admin Panel
        </Typography>
      )}
    </Box>
  );

  const drawerItems = actualIsLoggedIn ? (
    menuItems.map((item) => (
      <ListItem 
        button 
        key={item.text}
        onClick={() => {
          navigate(item.path);
          setDrawerOpen(false);
        }}
        className="drawer-list-item"
      >
        <ListItemIcon className="drawer-icon">
          {item.icon}
        </ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItem>
    ))
  ) : (
    <>
      <ListItem 
        button 
        onClick={() => {
          navigate("/login");
          setDrawerOpen(false);
        }}
        className="drawer-list-item"
      >
        <ListItemIcon className="drawer-icon">
          <LoginIcon />
        </ListItemIcon>
        <ListItemText primary="Login" />
      </ListItem>
      <ListItem 
        button 
        onClick={() => {
          navigate("/register");
          setDrawerOpen(false);
        }}
        className="drawer-list-item"
      >
        <ListItemIcon className="drawer-icon">
          <PersonAddIcon />
        </ListItemIcon>
        <ListItemText primary="Register" />
      </ListItem>
    </>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        color="primary" 
        className={`navbar ${scrolled ? "scrolled" : ""}`}
        elevation={scrolled ? 4 : 1}
        sx={{ height: 64 }}
      >
        <Toolbar className="navbar-toolbar">
          {/* Left Side - Logo and Title */}
          <Box 
            className="navbar-left"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer", display: 'flex', alignItems: 'center', mr: 2 }}
          >
            <Box className="logo-container">
              <img 
                src="/Logo.png"
                alt="SKB Properties Logo"
                className="navbar-logo"
              />
            </Box>
            <Typography variant="h6" component="span" className="navbar-text">
              SKB Properties
            </Typography>
          </Box>

          {/* Center - Menu Items (hidden on mobile) */}
          {!isMobile && navItems}

          {/* Right Side - Auth Icons */}
          <Box className="navbar-right">
            {actualIsLoggedIn ? (
              <IconButton 
                edge="end" 
                color="inherit" 
                onClick={logout}
                className="logout-button"
                title="Logout"
                size="large"
              >
                <LogoutIcon />
              </IconButton>
            ) : (
              <Box className="auth-icons">
                <IconButton 
                  color="inherit" 
                  onClick={() => navigate("/login")}
                  title="Login"
                  size="large"
                >
                  <LoginIcon />
                </IconButton>
                <IconButton 
                  color="inherit" 
                  onClick={() => navigate("/register")}
                  title="Register"
                  size="large"
                >
                  <PersonAddIcon />
                </IconButton>
              </Box>
            )}
          </Box>

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              className="navbar-menu-icon"
              size="large"
              sx={{ ml: 'auto' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>

        {/* Mobile Drawer */}
        <Drawer 
          anchor="left" 
          open={drawerOpen} 
          onClose={toggleDrawer(false)}
          className="navbar-drawer-container"
          ModalProps={{
            keepMounted: true
          }}
        >
          <Box 
            className="navbar-drawer"
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Box className="drawer-header">
              <Box className="logo-container">
                <img 
                  src="/Logo.png"
                  alt="SKB Properties Logo"
                  className="drawer-logo"
                />
              </Box>
              <Typography variant="h6" className="drawer-title">
                SKB Properties
              </Typography>
            </Box>
            <List>
              {drawerItems}
            </List>
          </Box>
        </Drawer>
      </AppBar>
      {/* Spacer to prevent content from being hidden behind navbar */}
      <Box sx={{ height: 64 }} />
    </>
  );
};

export default Navbar;