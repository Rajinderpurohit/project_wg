const User = require('../models/User');

// @desc      Get all users
// @route     GET /api/users
// @access    Private/Admin
exports.getUsers = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

// @desc      Update user status
// @route     PUT /api/users/:id/status
// @access    Private/Admin
exports.updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update status and increment jwtVersion
    user.status = req.body.status;
    user.jwtVersion = user.jwtVersion + 1;
    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}; 