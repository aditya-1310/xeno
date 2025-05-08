import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Container, Typography, Alert, CircularProgress } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import authService from '../services/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting login process...');
      await authService.login();
      console.log('Login successful, navigating to home...');
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Welcome to Xeno CRM
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Sign in to manage your customer segments and campaigns
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
          onClick={handleLogin}
          size="large"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
      </Box>
    </Container>
  );
};

export default Login; 