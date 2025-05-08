import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Segment, Customer } from '../models';
import { parseNaturalLanguageToRules } from '../services/ai';
import { ensureAuth } from '../middleware/auth';

const router = Router();

// Validation middleware
const validateSegment = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional().isString(),
  body('rules').isObject().withMessage('Rules must be a valid object'),
  body('createdBy').notEmpty().withMessage('Creator ID is required'),
];

// Create a new segment
router.post('/', ensureAuth, validateSegment, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const segment = await Segment.create(req.body);
    res.status(201).json(segment);
  } catch (error) {
    console.error('Error creating segment:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// Get all segments
router.get('/', ensureAuth, async (req, res) => {
  try {
    const segments = await Segment.findAll({
      include: [{
        model: Customer,
        attributes: ['id'],
      }],
    });
    res.json(segments);
  } catch (error) {
    console.error('Error fetching segments:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// Get segment by ID
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    const segment = await Segment.findByPk(req.params.id, {
      include: [{
        model: Customer,
        attributes: ['id', 'name', 'email'],
      }],
    });
    if (!segment) {
      return res.status(404).json({
        message: 'Segment not found',
      });
    }
    res.json(segment);
  } catch (error) {
    console.error('Error fetching segment:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// Preview segment size
router.post('/preview', ensureAuth, async (req, res) => {
  try {
    const { rules } = req.body;
    if (!rules) {
      return res.status(400).json({
        message: 'Rules are required',
      });
    }

    // Convert rules to SQL-like conditions
    const conditions = convertRulesToConditions(rules);
    
    // Count matching customers
    const count = await Customer.count({
      where: conditions,
    });

    res.json({ count });
  } catch (error) {
    console.error('Error previewing segment:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// Parse natural language to rules
router.post('/parse-query', ensureAuth, async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({
        message: 'Query is required',
      });
    }

    const rules = await parseNaturalLanguageToRules(query);
    res.json(rules);
  } catch (error) {
    console.error('Error parsing query:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// Helper function to convert rules to SQL conditions
function convertRulesToConditions(rules: any) {
  const conditions: any = {};
  
  if (rules.combinator === 'and') {
    rules.rules.forEach((rule: any) => {
      switch (rule.operator) {
        case '=':
          conditions[rule.field] = rule.value;
          break;
        case '!=':
          conditions[rule.field] = { [Op.ne]: rule.value };
          break;
        case '>':
          conditions[rule.field] = { [Op.gt]: rule.value };
          break;
        case '<':
          conditions[rule.field] = { [Op.lt]: rule.value };
          break;
        case '>=':
          conditions[rule.field] = { [Op.gte]: rule.value };
          break;
        case '<=':
          conditions[rule.field] = { [Op.lte]: rule.value };
          break;
        // Add more operators as needed
      }
    });
  }
  
  return conditions;
}

export default router; 