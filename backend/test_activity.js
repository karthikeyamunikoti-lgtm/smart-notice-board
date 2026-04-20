require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Notice = require('./models/Notice');
const User = require('./models/User');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/noticeboard');
        console.log('Connected to DB');
        
        const recentNotices = await Notice.find({ isDeleted: { $ne: true } })
          .populate('createdBy', 'name role')
          .sort({ createdAt: -1 })
          .limit(5);
          
        const recentUsers = await User.find({ role: 'Student' })
          .sort({ createdAt: -1 })
          .limit(5);

        const activity = [
          ...recentNotices.map(n => ({
            id: n._id,
            type: 'notice',
            text: `${n.createdBy?.name || 'Staff Member'} uploaded a new notice: "${n.title}"`,
            time: n.createdAt || new Date(),
            role: n.createdBy?.role || 'Staff'
          })),
          ...recentUsers.map(u => ({
            id: u._id,
            type: 'user',
            text: `New student registered: "${u.name}"`,
            time: u.createdAt || new Date(),
            role: 'Student'
          }))
        ].filter(a => a.time).sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

        console.log('SUCCESS:', activity);
        process.exit(0);
    } catch (e) {
        console.error('ERROR:', e.message);
        process.exit(1);
    }
}
run();
