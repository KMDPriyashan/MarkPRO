import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';
import { Navbar } from './Navbar';

export const Layout: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar onThemeToggle={handleThemeToggle} isDarkMode={isDarkMode} />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Outlet />
        </Container>
        <Box
          component="footer"
          sx={{
            py: 3,
            mt: 'auto',
            textAlign: 'center',
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} Attendance System. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};