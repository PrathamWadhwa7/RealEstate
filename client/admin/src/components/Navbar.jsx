// src/components/Navbar.jsx
import React, { useState } from "react";
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
  const isMobile = useMediaQuery("(max-width:768px)");
  
  // Debug: Log the isLoggedIn state
  console.log("Navbar isLoggedIn:", isLoggedIn);
  
  // Fallback to localStorage if prop is undefined (temporary fix)
  const actualIsLoggedIn = isLoggedIn !== undefined ? isLoggedIn : !!localStorage.getItem("token");

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
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
    <Box className="navbar-links">
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
    <AppBar position="fixed" color="primary" className="navbar">
      <Toolbar className="navbar-toolbar">
        {isMobile ? (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            className="navbar-menu-icon"
          >
            <MenuIcon />
          </IconButton>
        ) : (
          navItems
        )}

        <Box className="navbar-title">
          <img 
            src="/Logo.png"
            alt="SKB Properties Logo"
            className="navbar-logo"
            onClick={() => navigate("/")}
          />
          <Typography variant="h6" component="span" className="navbar-text">
            SKB Properties
          </Typography>
        </Box>

        {actualIsLoggedIn ? (
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={logout}
            className="logout-button"
            title="Logout"
          >
            <LogoutIcon />
          </IconButton>
        ) : (
          <Box className="auth-icons">
            <IconButton 
              color="inherit" 
              onClick={() => navigate("/login")}
              title="Login"
            >
              <LoginIcon />
            </IconButton>
            <IconButton 
              color="inherit" 
              onClick={() => navigate("/register")}
              title="Register"
            >
              <PersonAddIcon />
            </IconButton>
          </Box>
        )}
      </Toolbar>

      <Drawer 
        anchor="left" 
        open={drawerOpen} 
        onClose={toggleDrawer(false)}
        className="navbar-drawer-container"
        ModalProps={{
          keepMounted: true // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: 260, sm: 280 },
            boxSizing: 'border-box',
          },
        }}
      >
        <Box className="navbar-drawer">
          <Box className="drawer-header">
            <img 
              src="/Logo.png"
              alt="SKB Properties Logo"
              className="drawer-logo"
            />
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
  );
};

export default Navbar;