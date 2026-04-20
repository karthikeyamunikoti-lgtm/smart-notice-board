const Notice = require('../models/Notice');
const User = require('../models/User');

// @desc    Create a notice
// @route   POST /api/notices
// @access  Private (Admin, Staff)
const createNotice = async (req, res) => {
  try {
    const { title, description, category, priority, expiryDate } = req.body;
    
    // Status is 'Approved' if created by Admin, 'Pending' if by Staff
    const status = req.user.role === 'Admin' ? 'Approved' : 'Pending';

    const notice = await Notice.create({
      title,
      description,
      category,
      priority,
      expiryDate,
      createdBy: req.user._id,
      status,
      attachmentUrl: req.file ? `/uploads/${req.file.filename}` : '',
    });

    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all notices (Role based)
// @route   GET /api/notices
// @access  Private
const getNotices = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'Student') {
      // Show ALL approved notices to students while troubleshooting visibility
      query.status = 'Approved';
    } else if (req.user.role === 'Staff') {
      // Staff see all approved notices OR their own pending/rejected ones
      query = {
        $or: [
          { status: 'Approved' },
          { createdBy: req.user._id }
        ]
      };
    }
    
    // Global filter: Exclude soft-deleted notices
    if (query.$or) {
      query = { $and: [ { isDeleted: { $ne: true } }, query ] };
    } else {
      query.isDeleted = { $ne: true };
    }

    const notices = await Notice.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    // Debugging: return count and role check
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update notice
// @route   PUT /api/notices/:id
// @access  Private
const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    // Check ownership
    if (req.user.role !== 'Admin' && notice.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this notice' });
    }

    const updatedData = {
      title: req.body.title || notice.title,
      description: req.body.description || notice.description,
      category: req.body.category || notice.category,
      priority: req.body.priority || notice.priority,
      expiryDate: req.body.expiryDate || notice.expiryDate,
    };
    
    if (req.file) {
      updatedData.attachmentUrl = `/uploads/${req.file.filename}`;
    }



    // If Staff updates, reset status to Pending
    if (req.user.role === 'Staff') {
      updatedData.status = 'Pending';
    }

    const updatedNotice = await Notice.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updatedNotice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve/Reject notice
// @route   PATCH /api/notices/:id/status
// @access  Private/Admin
const updateNoticeStatus = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    notice.status = req.body.status;
    await notice.save();

    // Notify via Socket.io if approved
    if (notice.status === 'Approved') {
      const io = req.app.get('socketio');
      io.emit('newNotice', { message: 'A new notice has been approved!', title: notice.title });
    }

    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    // Check ownership
    if (req.user.role !== 'Admin' && notice.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this notice' });
    }

    // Soft delete
    notice.isDeleted = true;
    notice.deletedAt = Date.now();
    await notice.save();
    
    res.json({ message: 'Notice moved to trash' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/notices/stats
// @access  Private (Admin, Staff)
const getStats = async (req, res) => {
  try {
    const totalNotices = await Notice.countDocuments({ isDeleted: { $ne: true } });
    const approvedNotices = await Notice.countDocuments({ status: 'Approved', isDeleted: { $ne: true } });
    const pendingNotices = await Notice.countDocuments({ status: 'Pending', isDeleted: { $ne: true } });
    const expiredNotices = await Notice.countDocuments({ expiryDate: { $lt: new Date() }, isDeleted: { $ne: true } });
    const deletedNotices = await Notice.countDocuments({ isDeleted: true });

    res.json({
      totalNotices,
      approvedNotices,
      pendingNotices,
      expiredNotices,
      deletedNotices,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get recent activity
// @route   GET /api/notices/activity
// @access  Private (Admin)
const getActivity = async (req, res) => {
  try {
    console.log('Fetching recent activity...');
    const recentNotices = await Notice.find({ isDeleted: { $ne: true } })
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 })
      .limit(10);

    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(10);

    console.log(`Found ${recentNotices.length} notices and ${recentUsers.length} recent accounts`);

    const activity = [
      ...recentNotices.map(n => ({
        id: n._id.toString(),
        type: 'notice',
        text: `${n.createdBy?.name || 'Authorized Staff'} uploaded notice: "${n.title}"`,
        time: n.createdAt ? n.createdAt.toISOString() : new Date().toISOString(),
        role: n.createdBy?.role || 'Staff'
      })),
      ...recentUsers.map(u => ({
        id: u._id.toString(),
        type: 'user',
        text: `New account: "${u.name}" (${u.role})`,
        time: u.createdAt ? u.createdAt.toISOString() : new Date().toISOString(),
        role: u.role || 'User'
      }))
    ];

    // Filter out items without valid IDs or text, then sort and slice
    const finalActivity = activity
      .filter(a => a.id && a.text)
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 10);

    console.log(`Returning ${finalActivity.length} activity items`);
    res.json(finalActivity);
  } catch (error) {
    console.error('Activity Controller Error:', error);
    res.status(500).json({ message: 'Error retrieving activity feed: ' + error.message });
  }
};
// @desc    Get deleted notices (Trash)
// @route   GET /api/notices/trash
// @access  Private (Admin)
const getDeletedNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ isDeleted: true })
      .populate('createdBy', 'name email')
      .sort({ deletedAt: -1 });

    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Restore a deleted notice
// @route   PATCH /api/notices/:id/restore
// @access  Private (Admin)
const restoreNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    notice.isDeleted = false;
    notice.deletedAt = null;
    await notice.save();

    res.json({ message: 'Notice restored successfully', notice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Permanently delete a notice
// @route   DELETE /api/notices/:id/permanent
// @access  Private (Admin)
const permanentlyDeleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    await notice.deleteOne();
    res.json({ message: 'Notice permanently removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNotice,
  getNotices,
  updateNotice,
  updateNoticeStatus,
  deleteNotice,
  getStats,
  getActivity,
  getDeletedNotices,
  restoreNotice,
  permanentlyDeleteNotice
};
