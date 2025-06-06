import * as React from "react"
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Avatar,
  Box,
  Container,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Movie as MovieIcon,
  Upload as UploadIcon,
  Videocam as VideocamIcon,
  AccountCircle as AccountCircleIcon,
  ShoppingCart,
} from "@mui/icons-material"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { clearAuthToken } from '../../redux/authSlice/authSlice';
import logoIcon from "../../assets/LOGO UPSCALE.png"
import CartIcon from "../cartIcon/CartIcon";

export function Navebar1({
  onLogout = () => console.log("Logout clicked"),
}) {
  const { user } = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hasNotifications, setHasNotifications] = React.useState(true)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null)

  // Define all possible menu items
  const allMenuItems = [
    { name: "Home", icon: <MovieIcon />, href: "/showcase-projects" },
    { name: "Titles", icon: <MovieIcon />, href: "/projects" },
    { name: "Title Files", icon: <UploadIcon />, href: "/video-catalogue" },
    { name: "Deals", icon: <MovieIcon />, href: "/deals" },
    { name: "Services", icon: <VideocamIcon />, href: "/main" },
    { name: "Account", icon: <AccountCircleIcon />, href: "/user-org-register" },
  ];

  // Get menu items based on user role
  const getMenuItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'Admin':
        return allMenuItems;
      case 'Buyer':
        return allMenuItems.filter(item =>
          item.name === 'Home' || item.name === 'Deals'
        );
      case 'Seller':
        return allMenuItems.filter(item =>
          item.name !== 'Account'
        );
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationClick = () => {
    setHasNotifications(false)
  }

  // Inline styles
  const appBarStyle = {
    backgroundColor: "#0a1525",
    borderBottom: "1px solid #1e293b",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    padding: "0 24px"
  }

  const logoTextStyle = {
    fontWeight: 700,
    fontSize: "1.25rem",
    color: "#f8fafc",
  }

  const orangeSpanStyle = {
    color: "#ff7043",
  }

  const navLinkStyle = {
    color: "#fff",
    fontSize: "0.875rem",
    fontWeight: 500,
  }

  const navLinkHoverStyle = {
    color: "#f8fafc",
    backgroundColor: "transparent",
  }

  const iconButtonStyle = {
    color: "#fff",
  }

  const iconButtonHoverStyle = {
    color: "#f8fafc",
    backgroundColor: "#1e293b",
  }

  const avatarButtonStyle = {
    marginLeft: 1,
    padding: 0,
    border: "1px solid #334155",
  }

  const avatarButtonHoverStyle = {
    border: "1px solid #64748b",
  }

  const menuPaperStyle = {
    width: 220,
    backgroundColor: "#0a1525",
    border: "1px solid #1e293b",
    color: "#e2e8f0",
  }

  const menuItemHoverStyle = {
    backgroundColor: "#1e293b",
  }

  const drawerPaperStyle = {
    boxSizing: "border-box",
    width: 240,
    backgroundColor: "#0a1525",
    borderRight: "1px solid #1e293b",
    color: "#e2e8f0",
  }

  const drawerHeaderStyle = {
    height: 64,
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    borderBottom: "1px solid #1e293b",
  }

  const listItemStyle = {
    borderRadius: 4,
    marginBottom: 4,
  }

  const listItemHoverStyle = {
    backgroundColor: "#1e293b",
  }

  const listItemIconStyle = {
    color: "#cbd5e1",
    minWidth: 40,
  }

  const emailTextStyle = {
    color: "#94a3b8",
    fontSize: "0.75rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }

  const dividerStyle = {
    backgroundColor: "#1e293b",
  }

  const handleLogout = async () => {
    try {
      dispatch(clearAuthToken());

      // 🔁 Optional: call server logout to clear cookie
      const response = await fetch('https://media-shippers-backend.vercel.app/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();
      console.log("data inside the logout", data)
      if (data.success) {
        console.log('Logout successful');

        // Clear session storage
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('token');
        window.location.replace('/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AppBar position="sticky" style={appBarStyle}>
      <Toolbar disableGutters style={{ height: 64 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          style={{ ...iconButtonStyle, marginRight: 16, display: { xs: "flex", md: "none" } }}
          sx={{ display: { xs: "flex", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <RouterLink to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <Typography variant="h6" noWrap style={logoTextStyle}>
            {/* <span style={orangeSpanStyle}>Media</span>Shippers */}
            <img src={logoIcon} alt="Logo" style={{ maxWidth: "100%", height: "50px" }} />
          </Typography>
        </RouterLink>

        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "flex-end", gap: 1 }}>
          {menuItems.map((item) => (
            <Button
              key={item.name}
              component={RouterLink}
              to={item.href}
              style={navLinkStyle}
              sx={{ "&:hover": navLinkHoverStyle }}
            >
              {item.name}
            </Button>
          ))}
        </Box>

        <Box style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <IconButton
            color="inherit"
            onClick={handleNotificationClick}
            style={iconButtonStyle}
            sx={{ "&:hover": iconButtonHoverStyle }}
          >
            <Badge color="error" variant="dot" invisible={!hasNotifications}>
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>
            <CartIcon />
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            style={avatarButtonStyle}
            sx={{ "&:hover": avatarButtonHoverStyle }}
          >
            <Avatar
              alt={user?.name}
              src="/diverse-online-profiles.png"
              style={{ width: 32, height: 32, backgroundColor: "#334155" }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            style: menuPaperStyle,
            sx: { "& .MuiMenuItem-root:hover": menuItemHoverStyle },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box style={{ padding: "8px 16px" }}>
            <Typography variant="subtitle1" style={{ fontWeight: 500 }}>
              {user?.name}
            </Typography>
            <Typography variant="body2" style={emailTextStyle}>
              {user?.email}
            </Typography>
            <Typography variant="body2" style={{ ...emailTextStyle, color: '#ff7043' }}>
              {user?.role}
            </Typography>
          </Box>
          <Divider style={dividerStyle} />
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon style={listItemIconStyle}>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon style={listItemIconStyle}>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <Divider style={dividerStyle} />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon style={listItemIconStyle}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": drawerPaperStyle,
        }}
      >
        <Box style={drawerHeaderStyle}>
          <Typography variant="h6" style={logoTextStyle}>
            <span style={orangeSpanStyle}>Media</span>Shippers
          </Typography>
        </Box>
        <List style={{ padding: 16 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.name}
              component={RouterLink}
              to={item.href}
              style={listItemStyle}
              sx={{ "&:hover": listItemHoverStyle }}
            >
              <ListItemIcon style={listItemIconStyle}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  )
}