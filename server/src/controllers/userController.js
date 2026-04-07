const { User, Role, IssuedBook, Fine } = require('../models');

// Get all users (Admin / Librarian)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [Role],
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.update(req.body);
    res.json({ message: 'User updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
