import React from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Grid,
} from '@mui/material';

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'sending' | 'completed' | 'failed';
  stats: {
    total: number;
    sent: number;
    failed: number;
    pending: number;
  };
}

interface CampaignHistoryProps {
  campaigns: Campaign[];
}

const CampaignHistory: React.FC<CampaignHistoryProps> = ({ campaigns }) => {
  const activeCampaigns = campaigns.filter(
    (campaign) => campaign.status === 'sending'
  );

  if (activeCampaigns.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Active Campaigns
      </Typography>
      <Grid container spacing={2}>
        {activeCampaigns.map((campaign) => (
          <Grid item xs={12} key={campaign.id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {campaign.name}
              </Typography>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Progress: {campaign.stats.sent} / {campaign.stats.total}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(campaign.stats.sent / campaign.stats.total) * 100}
                  sx={{ mt: 1 }}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="success.main">
                    Sent: {campaign.stats.sent}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="error.main">
                    Failed: {campaign.stats.failed}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="warning.main">
                    Pending: {campaign.stats.pending}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CampaignHistory; 