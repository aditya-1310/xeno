import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import authService from '../services/auth';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (!token) {
          setError('No token received');
          return;
        }

        await authService.handleCallback(token);
        navigate('/');
      } catch (err) {
        setError('Failed to authenticate');
        console.error('Auth callback error:', err);
      }
    };

    handleCallback();
  }, [location, navigate]);

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Typography
          color="primary"
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/login')}
        >
          Return to login
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Authenticating...</Typography>
    </Box>
  );
};

export default AuthCallback; 