import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { campaignApi, segmentApi } from '../services/api';
import CampaignHistory from '../components/CampaignHistory';

interface Campaign {
  id: string;
  name: string;
  description: string;
  segmentId: string;
  status: 'draft' | 'sending' | 'completed' | 'failed';
  message: string;
  stats: {
    total: number;
    sent: number;
    failed: number;
    pending: number;
  };
  createdAt: string;
}

interface Segment {
  id: string;
  name: string;
}

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    segmentId: '',
    message: '',
  });
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    fetchCampaigns();
    fetchSegments();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await campaignApi.getAll();
      setCampaigns(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSegments = async () => {
    try {
      const response = await segmentApi.getAll();
      setSegments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching segments:', error);
      setSegments([]);
    }
  };

  const handleOpenDialog = (campaign?: Campaign) => {
    if (campaign) {
      setSelectedCampaign(campaign);
      setFormData({
        name: campaign.name,
        description: campaign.description,
        segmentId: campaign.segmentId,
        message: campaign.message,
      });
    } else {
      setSelectedCampaign(null);
      setFormData({
        name: '',
        description: '',
        segmentId: '',
        message: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCampaign(null);
    setFormData({
      name: '',
      description: '',
      segmentId: '',
      message: '',
    });
    setSuggestions([]);
  };

  const handleSubmit = async () => {
    try {
      const campaignData = {
        ...formData,
        createdBy: 'current-user-id', // This should come from auth context
      };

      if (selectedCampaign) {
        await campaignApi.update(selectedCampaign.id, campaignData);
      } else {
        await campaignApi.create(campaignData);
      }
      handleCloseDialog();
      fetchCampaigns();
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await campaignApi.delete(id);
        fetchCampaigns();
      } catch (error) {
        console.error('Error deleting campaign:', error);
      }
    }
  };

  const handleGetSuggestions = async () => {
    if (!formData.segmentId) return;

    setLoadingSuggestions(true);
    try {
      const segment = segments.find((s) => s.id === formData.segmentId);
      const response = await campaignApi.suggestMessages(
        'Increase engagement',
        `Campaign for segment: ${segment?.name}`
      );
      setSuggestions(response.data.variants || []);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Typography
          color={
            params.value === 'completed'
              ? 'success.main'
              : params.value === 'failed'
              ? 'error.main'
              : 'warning.main'
          }
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Button
            size="small"
            onClick={() => handleOpenDialog(params.row)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Campaigns</Typography>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Create Campaign
        </Button>
      </Box>

      <DataGrid
        rows={campaigns}
        columns={columns}
        loading={loading}
        autoHeight
        getRowId={(row) => row.id}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
      />

      <Box sx={{ mt: 4 }}>
        <CampaignHistory campaigns={campaigns} />
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedCampaign ? 'Edit Campaign' : 'Create Campaign'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Segment</InputLabel>
            <Select
              value={formData.segmentId}
              label="Segment"
              onChange={(e) =>
                setFormData({ ...formData, segmentId: e.target.value })
              }
            >
              {segments.map((segment) => (
                <MenuItem key={segment.id} value={segment.id}>
                  {segment.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Message"
            fullWidth
            multiline
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleGetSuggestions}
              disabled={!formData.segmentId || loadingSuggestions}
            >
              {loadingSuggestions ? (
                <CircularProgress size={24} />
              ) : (
                'Get Message Suggestions'
              )}
            </Button>
            {suggestions.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Suggested Messages:
                </Typography>
                {suggestions.map((suggestion, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 1,
                      mb: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      setFormData({ ...formData, message: suggestion.message })
                    }
                  >
                    <Typography variant="body2">{suggestion.message}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tone: {suggestion.tone}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedCampaign ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Campaigns; 