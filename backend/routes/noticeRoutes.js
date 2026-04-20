const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
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
} = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Multer storage setup
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

// Dashboard and Activity routes (defined first for priority)
router.get('/test', (req, res) => res.json({ message: 'Notice routes are working' }));
router.get('/stats', protect, authorize('Admin', 'Staff'), getStats);
router.get('/activity', protect, authorize('Admin'), getActivity);
router.get('/trash', protect, authorize('Admin'), getDeletedNotices);

// General Notice routes
router.get('/', protect, getNotices);
router.post('/', protect, authorize('Admin', 'Staff'), upload.single('attachment'), createNotice);

// Specific Notice routes
router.patch('/:id/restore', protect, authorize('Admin'), restoreNotice);
router.delete('/:id/permanent', protect, authorize('Admin'), permanentlyDeleteNotice);
router.patch('/:id/status', protect, authorize('Admin'), updateNoticeStatus);

router.route('/:id')
  .put(protect, authorize('Admin', 'Staff'), upload.single('attachment'), updateNotice)
  .delete(protect, authorize('Admin', 'Staff'), deleteNotice);

module.exports = router;
