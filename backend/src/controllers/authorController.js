const { Author } = require('../models');
const { logAction } = require('../utils/logger');

exports.getAll = async (req, res) => {
  try { res.json(await Author.findAll()); }
  catch (e) { res.status(500).json({ message: 'Server error' }); }
};
exports.create = async (req, res) => {
  try { 
    const a = await Author.create(req.body);
    await logAction({
      user_id: req.user.id,
      user_name: req.user.name,
      action: 'AUTHOR_CREATED',
      details: `Created author: ${a.name}`,
      ip_address: req.ip
    });
    res.status(201).json(a); 
  }
  catch (e) { res.status(500).json({ message: 'Server error' }); }
};
exports.update = async (req, res) => {
  try {
    const a = await Author.findByPk(req.params.id);
    if (!a) return res.status(404).json({ message: 'Not found' });
    await a.update(req.body); 
    await logAction({
      user_id: req.user.id,
      user_name: req.user.name,
      action: 'AUTHOR_UPDATED',
      details: `Updated author: ${a.name}`,
      ip_address: req.ip
    });
    res.json(a);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};
exports.remove = async (req, res) => {
  try {
    const a = await Author.findByPk(req.params.id);
    if (!a) return res.status(404).json({ message: 'Not found' });
    const name = a.name;
    await a.destroy(); 
    await logAction({
      user_id: req.user.id,
      user_name: req.user.name,
      action: 'AUTHOR_DELETED',
      details: `Deleted author: ${name}`,
      ip_address: req.ip
    });
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

