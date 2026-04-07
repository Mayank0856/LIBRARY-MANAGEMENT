const { Author } = require('../models');

exports.getAll = async (req, res) => {
  try { res.json(await Author.findAll()); }
  catch (e) { res.status(500).json({ message: 'Server error' }); }
};
exports.create = async (req, res) => {
  try { res.status(201).json(await Author.create(req.body)); }
  catch (e) { res.status(500).json({ message: 'Server error' }); }
};
exports.update = async (req, res) => {
  try {
    const a = await Author.findByPk(req.params.id);
    if (!a) return res.status(404).json({ message: 'Not found' });
    await a.update(req.body); res.json(a);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};
exports.remove = async (req, res) => {
  try {
    const a = await Author.findByPk(req.params.id);
    if (!a) return res.status(404).json({ message: 'Not found' });
    await a.destroy(); res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};
