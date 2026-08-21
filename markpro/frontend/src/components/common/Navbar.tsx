import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Tooltip,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  CheckCircle,
  History,
  People,
  Assessment,
  Settings,
  Logout,
  Notifications,
  AccountCircle,
  Brightness4,
  Brightness7,
  Event,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/auth.store';

interface NavbarProps {
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onThemeToggle,
  isDarkMode,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  useTheme();
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Check-in', icon: <CheckCircle />, path: '/check-in' },
    { text: 'History', icon: <History />, path: '/history' },
    { text: 'Leave', icon: <Event />, path: '/leave' },
  ];

  const adminMenuItems = [
    { text: 'Users', icon: <People />, path: '/admin/users' },
    { text: 'Reports', icon: <Assessment />, path: '/admin/reports' },
    { text: 'Settings', icon: <Settings />, path: '/admin/settings' },
  ];

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isManager = user?.role === 'MANAGER' || isAdmin;

  const drawerContent = (
    <Box sx={{ width: 280 }} role="presentation">
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          {user?.name?.charAt(0) || 'U'}
        </Avatar>
        <Box>
          <Typography variant="subtitle1">{user?.name || 'User'}</Typography>
          <Typography variant="caption" color="textSecondary">
            {user?.role || 'Employee'}
          </Typography>
        </Box>
      </Box>
      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => {
              navigate(item.path);
              toggleDrawer(false);
            }}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                color: 'primary.main',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? 'primary.main' : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}

        {(isAdmin || isManager) && (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ px: 2, color: 'text.secondary' }}>
              Administration
            </Typography>
            {isAdmin && (
              <>
                {adminMenuItems.map((item) => (
                  <ListItemButton
                    key={item.text}
                    onClick={() => {
                      navigate(item.path);
                      toggleDrawer(false);
                    }}
                    selected={location.pathname === item.path}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                ))}
              </>
            )}
          </>
        )}

        <Divider sx={{ my: 1 }} />
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  const userName = user?.name || 'User';
  const userEmail = user?.email || '';

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          {/* Menu Button - Mobile */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => toggleDrawer(true)}
            sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
            onClick={() => navigate('/dashboard')}
          >
            <CheckCircle sx={{ fontSize: 28 }} />
            <span>Attendance</span>
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, mr: 3 }}>
            {menuItems.map((item) => (
              <Typography
                key={item.text}
                variant="body2"
                sx={{
                  cursor: 'pointer',
                  color: location.pathname === item.path ? '#fff' : 'rgba(255,255,255,0.7)',
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  '&:hover': { color: '#fff' },
                }}
                onClick={() => navigate(item.path)}
              >
                {item.text}
              </Typography>
            ))}
          </Box>

          {/* Right Side Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Theme Toggle */}
            <Tooltip title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
              <IconButton color="inherit" onClick={onThemeToggle}>
                {isDarkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={handleNotificationOpen}>
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* User Profile */}
            <Tooltip title="Profile">
              <IconButton
                onClick={handleMenuOpen}
                color="inherit"
                sx={{ p: 0.5 }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'secondary.main',
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem disabled>
          <Box>
            <Typography variant="subtitle2">{userName}</Typography>
            <Typography variant="caption" color="textSecondary">
              {userEmail}
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Typography variant="subtitle2">Notifications</Typography>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Box>
            <Typography variant="body2">✅ Check-in successful</Typography>
            <Typography variant="caption" color="textSecondary">
              5 minutes ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box>
            <Typography variant="body2">⚠️ You were late today</Typography>
            <Typography variant="caption" color="textSecondary">
              1 hour ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box>
            <Typography variant="body2">📋 Leave request approved</Typography>
            <Typography variant="caption" color="textSecondary">
              2 hours ago
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { navigate('/notifications'); handleNotificationClose(); }}>
          <Typography variant="body2" color="primary">
            View all notifications
          </Typography>
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};