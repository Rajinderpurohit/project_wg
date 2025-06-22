const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  bulkUpdateTasksStatus,
} = require('../controllers/tasks');
const Task = require('../models/Task');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

const { protect } = require('../middleware/auth');

// All task routes are protected
router.use(protect);

router.route('/bulk-update-status').put(bulkUpdateTasksStatus);

// Middleware to set req.advancedFilter for user-specific task queries
function setUserTaskFilter(req, res, next) {
  if (req.user && req.user.role !== 'admin') {
    req.advancedFilter = { user: req.user.id };
  }
  next();
}

router
  .route('/')
  .get(setUserTaskFilter, advancedResults(Task, [
    { path: 'user', select: 'name' },
    { path: 'createdBy', select: 'name' },
    { path: 'updatedBy', select: 'name' }
  ]), getTasks)
  .post(createTask);
  
router
  .route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router; 