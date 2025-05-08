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
  Paper,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { segmentApi } from '../services/api';
import RuleBuilder from '../components/RuleBuilder';
import { RuleGroupType } from 'react-querybuilder';

interface Segment {
  id: string;
  name: string;
  description: string;
  rules: RuleGroupType;
  customerCount: number;
  createdBy: string;
  createdAt: string;
}

const Segments: React.FC = () => {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [rules, setRules] = useState<RuleGroupType>({
    combinator: 'and',
    rules: [],
  });
  const [previewCount, setPreviewCount] = useState<number | null>(null);

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      const response = await segmentApi.getAll();
      setSegments(response.data);
    } catch (error) {
      console.error('Error fetching segments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (segment?: Segment) => {
    if (segment) {
      setSelectedSegment(segment);
      setFormData({
        name: segment.name,
        description: segment.description,
      });
      setRules(segment.rules);
    } else {
      setSelectedSegment(null);
      setFormData({
        name: '',
        description: '',
      });
      setRules({
        combinator: 'and',
        rules: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSegment(null);
    setFormData({
      name: '',
      description: '',
    });
    setRules({
      combinator: 'and',
      rules: [],
    });
    setPreviewCount(null);
  };

  const handleSubmit = async () => {
    try {
      const segmentData = {
        ...formData,
        rules,
        createdBy: 'current-user-id', // This should come from auth context
      };

      if (selectedSegment) {
        await segmentApi.update(selectedSegment.id, segmentData);
      } else {
        await segmentApi.create(segmentData);
      }
      handleCloseDialog();
      fetchSegments();
    } catch (error) {
      console.error('Error saving segment:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this segment?')) {
      try {
        await segmentApi.delete(id);
        fetchSegments();
      } catch (error) {
        console.error('Error deleting segment:', error);
      }
    }
  };

  const handlePreview = async (rules: RuleGroupType) => {
    try {
      const response = await segmentApi.preview(rules);
      setPreviewCount(response.data.count);
    } catch (error) {
      console.error('Error previewing segment:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'customerCount',
      headerName: 'Customer Count',
      flex: 1,
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
        <Typography variant="h5">Segments</Typography>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Create Segment
        </Button>
      </Box>

      <DataGrid
        rows={segments}
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

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedSegment ? 'Edit Segment' : 'Create Segment'}
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
          <Box sx={{ mt: 2 }}>
            <RuleBuilder
              onSave={setRules}
              onPreview={handlePreview}
            />
            {previewCount !== null && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                This segment will include {previewCount} customers
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedSegment ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Segments; 