const { Category } = require('../models');

exports.getAll = async (req, res) => {
  try {
    res.json(await Category.findAll());
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.create = async (req, res) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json(cat);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.update = async (req, res) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Not found' });
    await cat.update(req.body);
    res.json(cat);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.remove = async (req, res) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Not found' });
    await cat.destroy();
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};
