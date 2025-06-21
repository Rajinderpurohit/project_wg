const express = require('express');
const {
  getTasks,
  bulkUpdateTasksStatus,
} = require('../controllers/tasks');
const Task = require('../models/Task');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All task routes are protected
router.use(protect);

router.route('/')
  .get(advancedResults(Task), getTasks);

router.route('/bulk-update-status')
  .put(bulkUpdateTasksStatus);

module.exports = router; 