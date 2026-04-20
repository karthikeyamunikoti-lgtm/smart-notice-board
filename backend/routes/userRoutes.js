const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, updateUserRole } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('Admin'), getUsers);
router.patch('/:id/role', protect, authorize('Admin'), updateUserRole);
router.delete('/:id', protect, authorize('Admin'), deleteUser);

module.exports = router;
