const { User, Role, IssuedBook, Fine } = require('../models');
const { logAction } = require('../utils/logger');
const bcrypt = require('bcrypt');

// Get all users (Admin / Librarian)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role }],
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create User (Admin only)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role_id, phone, status } = req.body;
    
    const newUser = await User.create({
      name, email, password, role_id, phone, status: status || 'Active'
    });

    await logAction({
      user_id: req.user.id,
      user_name: req.user.name,
      action: 'USER_CREATED',
      details: `Created new user: ${name} (${email}) with role ID: ${role_id}`,
      ip_address: req.ip
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, password, name, phone, address, status, role_id } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Security check: If changing own password, verify current password
    if (password && id == req.user.id) {
       if (!currentPassword) {
         return res.status(400).json({ message: 'Current password is required to set a new password' });
       }
       const isMatch = await user.validatePassword(currentPassword);
       if (!isMatch) {
         return res.status(401).json({ message: 'Incorrect current password' });
       }
    }

    // Role check: Only admin can change role_id or status of others
    const updateData = { name, phone, address };
    if (req.user.role === 'Admin') {
       if (status) updateData.status = status;
       if (role_id) updateData.role_id = role_id;
    }
    if (password) updateData.password = password;

    await user.update(updateData);

    await logAction({
      user_id: req.user.id,
      user_name: req.user.name,
      action: 'USER_UPDATED',
      details: `Updated user profile for: ${user.name} (${user.email})`,
      ip_address: req.ip
    });

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const userName = user.name;
    const userEmail = user.email;

    await user.destroy();

    await logAction({
      user_id: req.user.id,
      user_name: req.user.name,
      action: 'USER_DELETED',
      details: `Deleted user: ${userName} (${userEmail})`,
      ip_address: req.ip
    });

    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

