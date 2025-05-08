import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Login from './components/Login';
import AuthCallback from './components/AuthCallback';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Customers from './pages/Customers';
import Segments from './pages/Segments';
import Campaigns from './pages/Campaigns';
import ErrorBoundary from './components/ErrorBoundary';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout>
                    <Navigate to="/customers" replace />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <PrivateRoute>
                  <Layout>
                    <Customers />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/segments"
              element={
                <PrivateRoute>
                  <Layout>
                    <Segments />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/campaigns"
              element={
                <PrivateRoute>
                  <Layout>
                    <Campaigns />
                  </Layout>
                </PrivateRoute>
              }
            />
            {/* Add more routes here as we create the components */}
          </Routes>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
