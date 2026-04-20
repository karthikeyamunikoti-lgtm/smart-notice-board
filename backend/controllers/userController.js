const User = require('../models/User');
const Notice = require('../models/Notice');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).lean();
    
    // Add notice counts to each user
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const noticeCount = await Notice.countDocuments({ createdBy: user._id });
      return { ...user, noticeCount };
    }));

    res.json(usersWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  console.log(`Attempting to update role for user ${id} to ${role}`);

  try {
    const user = await User.findById(id);

    if (!user) {
      console.log(`User ${id} not found`);
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }
    
    user.role = role || user.role;
    const updatedUser = await user.save();
    console.log(`Successfully updated role for ${user.name}`);
    res.json(updatedUser);
  } catch (error) {
    console.error('Update Role Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'Admin') {
        return res.status(400).json({ message: 'Cannot delete admin user' });
      }
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  updateUserRole,
};
