const Task = require('../models/Task');

// @desc      Get all tasks
// @route     GET /api/tasks
// @access    Private
exports.getTasks = async (req, res, next) => {
    // Check for dummy data
    const count = await Task.countDocuments();
    if (count === 0) {
      await createDummyTasks();
    }
    // Re-run the query to get the updated list
    const tasks = await Task.find().limit(req.query.limit || 5).skip(req.query.page ? (req.query.page - 1) * (req.query.limit || 5) : 0);
    const total = await Task.countDocuments();
    const pages = Math.ceil(total / (req.query.limit || 5));
    res.status(200).json({ success: true, count: total, pages, data: tasks, pagination: { total, pages } });
};

// @desc      Bulk update task status
// @route     PUT /api/tasks/bulk-update-status
// @access    Private/Admin
exports.bulkUpdateTasksStatus = async (req, res, next) => {
  const { taskIds, status } = req.body;
  try {
    await Task.updateMany(
      { _id: { $in: taskIds } },
      { $set: { status: status } }
    );
    res.status(200).json({ success: true, message: 'Tasks updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Function to create dummy tasks
const createDummyTasks = async () => {
  const tasks = [
    { title: 'Task 1', description: 'Description for task 1' },
    { title: 'Task 2', description: 'Description for task 2' },
    { title: 'Task 3', description: 'Description for task 3' },
    { title: 'Task 4', description: 'Description for task 4' },
    { title: 'Task 5', description: 'Description for task 5' },
    { title: 'Task 6', description: 'Description for task 6' },
    { title: 'Task 7', description: 'Description for task 7' },
    { title: 'Task 8', description: 'Description for task 8' },
    { title: 'Task 9', description: 'Description for task 9' },
    { title: 'Task 10', description: 'Description for task 10' },
    { title: 'Task 11', description: 'Description for task 11' },
    { title: 'Task 12', description: 'Description for task 12' },
    { title: 'Task 13', description: 'Description for task 13' },
    { title: 'Task 14', description: 'Description for task 14' },
    { title: 'Task 15', description: 'Description for task 15' },
  ];
  await Task.insertMany(tasks);
}; 