const User = require('../models/User');

const seedData = async () => {
    try {
        const adminExists = await User.findOne({ email: 'admin@test.com' });
        if (!adminExists) {
            await User.create({
                name: 'Admin User',
                email: 'admin@test.com',
                password: '123456',
                role: 'Admin'
            });
            console.log('Seed: Admin user created');
        }

        const staffExists = await User.findOne({ email: 'staff@test.com' });
        if (!staffExists) {
            await User.create({
                name: 'Staff User',
                email: 'staff@test.com',
                password: '123456',
                role: 'Staff'
            });
            console.log('Seed: Staff user created');
        }

        const studentExists = await User.findOne({ email: 'student@test.com' });
        if (!studentExists) {
            await User.create({
                name: 'Student User',
                email: 'student@test.com',
                password: '123456',
                role: 'Student'
            });
            console.log('Seed: Student user created');
        }
    } catch (error) {
        console.error('Seed error:', error);
    }
};

module.exports = seedData;
