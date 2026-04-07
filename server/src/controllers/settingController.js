const { Setting } = require('../models');

// Get all settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll();
    const config = {};
    settings.forEach(s => { config[s.key] = s.value; });
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update or Create settings
exports.updateSettings = async (req, res) => {
  try {
    const updates = req.body; // e.g., { fine_per_day: '10', max_books: '5' }
    for (const [key, value] of Object.entries(updates)) {
      await Setting.upsert({ key, value: String(value) });
    }
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
