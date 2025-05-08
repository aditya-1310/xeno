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
  Alert,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { customerApi } from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { validateCustomer, ValidationError } from '../utils/validation';

interface Customer {
  id: string;
  name: string;
  email: string;
  lastActive: string;
  totalSpent: number;
  visitCount: number;
  orderCount: number;
  daysSinceLastOrder: number;
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customerApi.getAll();
      setCustomers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setSelectedCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email,
      });
    } else {
      setSelectedCustomer(null);
      setFormData({
        name: '',
        email: '',
      });
    }
    setErrors([]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCustomer(null);
    setFormData({
      name: '',
      email: '',
    });
    setErrors([]);
  };

  const handleSubmit = async () => {
    const validationErrors = validateCustomer(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (selectedCustomer) {
        await customerApi.update(selectedCustomer.id, formData);
      } else {
        await customerApi.create(formData);
      }
      handleCloseDialog();
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerApi.delete(id);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'lastActive',
      headerName: 'Last Active',
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'totalSpent',
      headerName: 'Total Spent',
      flex: 1,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
    },
    {
      field: 'visitCount',
      headerName: 'Visit Count',
      flex: 1,
    },
    {
      field: 'orderCount',
      headerName: 'Order Count',
      flex: 1,
    },
    {
      field: 'daysSinceLastOrder',
      headerName: 'Days Since Last Order',
      flex: 1,
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
        <Typography variant="h5">Customers</Typography>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Add Customer
        </Button>
      </Box>

      {loading ? (
        <LoadingSkeleton type="table" rows={5} />
      ) : (
        <DataGrid
          rows={customers}
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
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedCustomer ? 'Edit Customer' : 'Add Customer'}
        </DialogTitle>
        <DialogContent>
          {errors.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.map((error) => (
                <div key={error.field}>{error.message}</div>
              ))}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.some((error) => error.field === 'name')}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.some((error) => error.field === 'email')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedCustomer ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers; 