const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status !== 'Active') {
      return res.status(403).json({ message: 'User account is not active' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.Role.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.Role.name
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, enrollment_no, department } = req.body;

    // By default, open registration registers as 'Student'
    const studentRole = await Role.findOne({ where: { name: 'Student' } });

    const newUser = await User.create({
      name,
      email,
      password,
      phone,
      enrollment_no,
      department,
      role_id: studentRole.id
    });

    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, possibly duplicate email or enrollment no.' });
  }
};
