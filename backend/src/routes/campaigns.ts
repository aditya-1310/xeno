import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Campaign, Segment, Customer } from '../models';
import { publishToQueue } from '../services/rabbitmq';
import { generateCampaignInsights, suggestMessageVariants } from '../services/ai';
import { ensureAuth } from '../middleware/auth';

const router = Router();

// Validation middleware
const validateCampaign = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional().isString(),
  body('segmentId').isUUID().withMessage('Invalid segment ID'),
  body('message').notEmpty().withMessage('Message is required'),
  body('createdBy').notEmpty().withMessage('Creator ID is required'),
];

// Create a new campaign
router.post('/', ensureAuth, validateCampaign, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const campaign = await Campaign.create({
      ...req.body,
      status: 'draft',
      stats: {
        total: 0,
        sent: 0,
        failed: 0,
        pending: 0,
      },
    });

    // Publish to queue for async processing
    await publishToQueue('campaign_delivery', {
      type: 'create',
      campaignId: campaign.id,
    });

    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// Get all campaigns
router.get('/', ensureAuth, async (req, res) => {
  try {
    const campaigns = await Campaign.findAll({
      include: [{
        model: Segment,
        attributes: ['id', 'name'],
      }],
      order: [['createdAt', 'DESC']],
    });
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// Get campaign by ID
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id, {
      include: [{
        model: Segment,
        attributes: ['id', 'name'],
      }],
    });
    if (!campaign) {
      return res.status(404).json({
        message: 'Campaign not found',
      });
    }
    res.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// Get campaign insights
router.get('/:id/insights', ensureAuth, async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({
        message: 'Campaign not found',
      });
    }

    const insights = await generateCampaignInsights(campaign.stats);
    res.json({ insights });
  } catch (error) {
    console.error('Error generating campaign insights:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// Get message suggestions
router.post('/suggest-messages', ensureAuth, async (req, res) => {
  try {
    const { objective, audienceDescription } = req.body;
    if (!objective || !audienceDescription) {
      return res.status(400).json({
        message: 'Objective and audience description are required',
      });
    }

    const suggestions = await suggestMessageVariants(objective, audienceDescription);
    res.json(suggestions);
  } catch (error) {
    console.error('Error suggesting messages:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// Update campaign delivery status
router.post('/:id/delivery-status', ensureAuth, async (req, res) => {
  try {
    const { status, customerId } = req.body;
    if (!status || !customerId) {
      return res.status(400).json({
        message: 'Status and customer ID are required',
      });
    }

    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({
        message: 'Campaign not found',
      });
    }

    // Update stats based on delivery status
    const stats = { ...campaign.stats };
    if (status === 'sent') {
      stats.sent += 1;
      stats.pending -= 1;
    } else if (status === 'failed') {
      stats.failed += 1;
      stats.pending -= 1;
    }

    await campaign.update({ stats });

    res.json({ message: 'Delivery status updated' });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

export default router; 