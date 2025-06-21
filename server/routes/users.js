const express = require('express');
const {
  getUsers,
  updateUserStatus,
} = require('../controllers/users');
const User = require('../models/User');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All these routes are protected and for admin only
router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(User), getUsers);
router.route('/:id/status').put(updateUserStatus);

module.exports = router; 