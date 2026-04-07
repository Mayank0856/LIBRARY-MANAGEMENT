const { Publisher } = require('../models');

exports.getAll = async (req, res) => {
  try { res.json(await Publisher.findAll()); }
  catch (e) { res.status(500).json({ message: 'Server error' }); }
};
exports.create = async (req, res) => {
  try { res.status(201).json(await Publisher.create(req.body)); }
  catch (e) { res.status(500).json({ message: 'Server error' }); }
};
exports.update = async (req, res) => {
  try {
    const p = await Publisher.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    await p.update(req.body); res.json(p);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};
exports.remove = async (req, res) => {
  try {
    const p = await Publisher.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    await p.destroy(); res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};
