import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Customer } from '../models';
import { publishToQueue } from '../services/rabbitmq';
import { ensureAuth } from '../middleware/auth';

const router = Router();

// Validation middleware
const validateCustomer = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('name').notEmpty().withMessage('Name is required'),
  body('lastActive').optional().isISO8601().withMessage('Invalid date format'),
  body('totalSpent').optional().isNumeric().withMessage('Total spent must be a number'),
  body('visitCount').optional().isInt().withMessage('Visit count must be an integer'),
  body('orderCount').optional().isInt().withMessage('Order count must be an integer'),
  body('daysSinceLastOrder').optional().isInt().withMessage('Days since last order must be an integer'),
];

// Create a new customer
router.post('/', ensureAuth, validateCustomer, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Publish to queue for async processing
    await publishToQueue('customer_data', {
      type: 'create',
      data: req.body,
    });

    res.status(202).json({
      message: 'Customer data accepted for processing',
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// Get all customers
router.get('/', ensureAuth, async (req, res) => {
  try {
    const customers = await Customer.findAll({
      limit: 100, // Add pagination in production
    });
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// Get customer by ID
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({
        message: 'Customer not found',
      });
    }
    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// Update customer
router.put('/:id', ensureAuth, validateCustomer, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Publish to queue for async processing
    await publishToQueue('customer_data', {
      type: 'update',
      id: req.params.id,
      data: req.body,
    });

    res.status(202).json({
      message: 'Customer update accepted for processing',
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// Delete customer
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    // Publish to queue for async processing
    await publishToQueue('customer_data', {
      type: 'delete',
      id: req.params.id,
    });

    res.status(202).json({
      message: 'Customer deletion accepted for processing',
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

export default router; 