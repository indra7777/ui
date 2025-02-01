import { Student } from '../models/student.js';

export const getStudentCount = async () => {
    try {
        // Get total count of all students
        const count = await Student.countDocuments();
        // Add 600 to the actual count
        return count + 600;
    } catch (error) {
        console.error('Error getting student count:', error);
        // Return 600 as fallback in case of error
        return 600;
    }
};
