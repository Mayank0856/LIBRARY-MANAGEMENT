const { Category } = require('../models');
const { logAction } = require('../utils/logger');

exports.getAll = async (req, res) => {
  try {
    res.json(await Category.findAll());
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.create = async (req, res) => {
  try {
    const cat = await Category.create(req.body);
    await logAction({
      user_id: req.user.id,
      user_name: req.user.name,
      action: 'CATEGORY_CREATED',
      details: `Created category: ${cat.name}`,
      ip_address: req.ip
    });
    res.status(201).json(cat);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.update = async (req, res) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Not found' });
    await cat.update(req.body);
    await logAction({
      user_id: req.user.id,
      user_name: req.user.name,
      action: 'CATEGORY_UPDATED',
      details: `Updated category: ${cat.name}`,
      ip_address: req.ip
    });
    res.json(cat);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.remove = async (req, res) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Not found' });
    const name = cat.name;
    await cat.destroy();
    await logAction({
      user_id: req.user.id,
      user_name: req.user.name,
      action: 'CATEGORY_DELETED',
      details: `Deleted category: ${name}`,
      ip_address: req.ip
    });
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

