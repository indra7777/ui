const Student = require('../models/student');

const getStudentCount = async (req, res) => {
    try {
        const count = await Student.countDocuments();
        return count;
    } catch (error) {
        console.error('Error getting student count:', error);
        return 0;
    }
};

module.exports = {
    getStudentCount
};
