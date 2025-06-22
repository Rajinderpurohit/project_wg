const Task = require('../models/Task');

// @desc      Get all tasks
// @route     GET /api/tasks
// @access    Private
exports.getTasks = async (req, res, next) => {
  try {
    // Populate createdBy and updatedBy with user names
    const results = await res.advancedResults.query
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name');
    res.status(200).json({
      success: true,
      count: results.length,
      pagination: res.advancedResults.pagination,
      data: results
    });
  } catch(err) {
     res.status(400).json({ success: false, message: 'Error fetching tasks' });
  }
};

// @desc      Create new task
// @route     POST /api/tasks
// @access    Private
exports.createTask = async (req, res, next) => {
  // Add the logged-in user's ID to the request body
  req.body.user = req.user.id;
  req.body.createdBy = req.user.id;
  req.body.updatedBy = req.user.id;
  
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc      Get single task
// @route     GET /api/tasks/:id
// @access    Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Make sure user is task owner or an admin
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to access this task' });
    }
    
    res.status(200).json({ success: true, data: task });
  } catch(err) {
    res.status(400).json({ success: false, message: 'Error retrieving task' });
  }
};


// @desc      Update task
// @route     PUT /api/tasks/:id
// @access    Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Make sure user is task owner or an admin
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this task' });
    }

    req.body.updatedBy = req.user.id;
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: task });
  } catch(err) {
    res.status(400).json({ success: false, message: 'Error updating task' });
  }
};


// @desc      Delete task
// @route     DELETE /api/tasks/:id
// @access    Private
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Make sure user is task owner or an admin
        if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this task' });
        }
        
        await task.remove();

        res.status(200).json({ success: true, data: {} });
    } catch(err) {
        res.status(400).json({ success: false, message: 'Error deleting task' });
    }
};


// @desc      Bulk update task status
// @route     PUT /api/tasks/bulk-update-status
// @access    Private
exports.bulkUpdateTasksStatus = async (req, res, next) => {
  const { taskIds, status } = req.body;
  
  // Base query to select tasks by their IDs
  let query = { _id: { $in: taskIds } };

  // If the user is not an admin, add a condition to the query
  // to ensure they can only update tasks they own.
  if (req.user.role !== 'admin') {
    query.user = req.user.id;
  }
  
  try {
    const result = await Task.updateMany(query, { $set: { status: status } });
    if (result.nModified === 0 && taskIds.length > 0) {
        return res.status(401).json({ success: false, message: 'Not authorized to update one or more of the selected tasks.' });
    }
    res.status(200).json({ success: true, message: 'Tasks updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}; 