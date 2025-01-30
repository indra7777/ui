import { Student } from '../models/student.js';

export const getStudentCount = async () => {
    try {
        // Get total count of all students
        const count = await Student.countDocuments();
        return count;
    } catch (error) {
        console.error('Error getting student count:', error);
        return 0;
    }
};
