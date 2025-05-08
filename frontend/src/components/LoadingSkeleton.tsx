import React from 'react';
import { Box, Skeleton, Card, CardContent, Grid } from '@mui/material';

interface LoadingSkeletonProps {
  type: 'table' | 'card' | 'form';
  rows?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type, rows = 5 }) => {
  if (type === 'table') {
    return (
      <Box sx={{ width: '100%' }}>
        <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
        {Array.from(new Array(rows)).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            height={50}
            sx={{ mb: 1 }}
          />
        ))}
      </Box>
    );
  }

  if (type === 'card') {
    return (
      <Grid container spacing={2}>
        {Array.from(new Array(rows)).map((_, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="rectangular" height={8} sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  {Array.from(new Array(4)).map((_, i) => (
                    <Grid item xs={3} key={i}>
                      <Skeleton variant="text" width="100%" />
                      <Skeleton variant="text" width="60%" />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (type === 'form') {
    return (
      <Box sx={{ width: '100%' }}>
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
        {Array.from(new Array(rows)).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            height={56}
            sx={{ mb: 2 }}
          />
        ))}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Skeleton variant="rectangular" width={100} height={36} />
          <Skeleton variant="rectangular" width={100} height={36} />
        </Box>
      </Box>
    );
  }

  return null;
};

export default LoadingSkeleton; 