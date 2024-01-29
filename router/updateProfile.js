const express = require('express');
const router = express.Router();
import { Student } from "../models/student";
import { comparePasswords,protect,hashPassword,createJWT } from "../handlers/auth";
router.get('/api/profile', protect, async (req, res) => {
    try {
        const user = await Student.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while retrieving the user profile' });
    }
});

router.put('/api/update-profile', protect, upload.single('image'), async (req, res) => {
try {
const updatedUser = await Student.findOneAndUpdate(
{ _id: req.user._id },
{
name: req.body.name,
email: req.body.email,
collegeName: req.body.collegeName,
stream: req.body.stream,
branch: req.body.branch,
phone: req.body.phone,
currentYear: req.body.currentYear,
passedOutYear: req.body.passedOutYear,
image: req.file ? req.file.filename : req.user.image,
},
{ new: true }
);

res.json({ success: true, data: updatedUser });
} catch (error) {
console.error(error);
res.status(500).json({ success: false, message: 'An error occurred while updating the user profile' });
}
});

module.exports = router;