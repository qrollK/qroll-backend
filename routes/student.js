const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const Student = require('../models/Student'); // Adjust path if needed

// @route   POST /api/student/onboarding
// @desc    Save student profile details (year, department, division)
// @access  Private
router.post('/onboarding', verifyToken, async (req, res) => {
  try {
    const { year, department, division } = req.body;
    const email = req.user.email;

    // Validate inputs
    if (!year || !department || !division) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find the student by email
    let student = await Student.findOne({ email });

    if (!student) {
      // If not found, create a new student document
      student = new Student({ email, year, department, division });
    } else {
      // If exists, update their profile
      student.year = year;
      student.department = department;
      student.division = division;
    }

    await student.save();

    res.status(200).json({ message: 'Student profile updated successfully' });
  } catch (error) {
    console.error('Student onboarding error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
