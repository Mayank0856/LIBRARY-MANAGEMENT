const { Publisher } = require('../models');
const { logAction } = require('../utils/logger');

exports.getAll = async (req, res) => {
  try { res.json(await Publisher.findAll()); }
  catch (e) { res.status(500).json({ message: 'Server error' }); }
};
exports.create = async (req, res) => {
  try { 
    const p = await Publisher.create(req.body);
    await logAction({
      user_id: req.user.id,
      user_name: req.user.name,
      action: 'PUBLISHER_CREATED',
      details: `Created publisher: ${p.name}`,
      ip_address: req.ip
    });
    res.status(201).json(p); 
  }
  catch (e) { res.status(500).json({ message: 'Server error' }); }
};
exports.update = async (req, res) => {
  try {
    const p = await Publisher.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    await p.update(req.body); 
    await logAction({
      user_id: req.user.id,
      user_name: req.user.name,
      action: 'PUBLISHER_UPDATED',
      details: `Updated publisher: ${p.name}`,
      ip_address: req.ip
    });
    res.json(p);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};
exports.remove = async (req, res) => {
  try {
    const p = await Publisher.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    const name = p.name;
    await p.destroy(); 
    await logAction({
      user_id: req.user.id,
      user_name: req.user.name,
      action: 'PUBLISHER_DELETED',
      details: `Deleted publisher: ${name}`,
      ip_address: req.ip
    });
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

