const express = require('express');
const router = express.Router();

// Get all customers
router.get('/', async (req, res) => {
  try {
    // TODO: Implement customer fetching from MongoDB
    // For now, return mock data
    const mockCustomers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        lastActive: new Date().toISOString(),
        totalSpent: 1500.00,
        visitCount: 15,
        orderCount: 5,
        daysSinceLastOrder: 3
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        lastActive: new Date().toISOString(),
        totalSpent: 2300.50,
        visitCount: 23,
        orderCount: 8,
        daysSinceLastOrder: 1
      }
    ];
    res.json(mockCustomers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching customers' });
  }
});

// Get customer by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement customer fetching by ID
    res.json({ message: `Get customer ${id}` });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching customer' });
  }
});

// Create customer
router.post('/', async (req, res) => {
  try {
    const customerData = req.body;
    // TODO: Implement customer creation
    res.status(201).json({ message: 'Customer created', data: customerData });
  } catch (error) {
    res.status(500).json({ error: 'Error creating customer' });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const customerData = req.body;
    // TODO: Implement customer update
    res.json({ message: `Update customer ${id}`, data: customerData });
  } catch (error) {
    res.status(500).json({ error: 'Error updating customer' });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement customer deletion
    res.json({ message: `Delete customer ${id}` });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting customer' });
  }
});

module.exports = router; 