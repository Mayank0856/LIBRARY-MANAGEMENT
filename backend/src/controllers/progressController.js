const { ReadingProgress } = require('../models');

// GET /api/progress/:bookId  — get saved page for this student+book
exports.getProgress = async (req, res) => {
  try {
    const progress = await ReadingProgress.findOne({
      where: { student_id: req.user.id, book_id: req.params.bookId }
    });
    res.json(progress || { page_number: 1, total_pages: null, percent_complete: 0 });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

// POST /api/progress/:bookId  — upsert progress
exports.saveProgress = async (req, res) => {
  try {
    const { page_number, total_pages } = req.body;
    const percent_complete = total_pages > 0
      ? Math.round((page_number / total_pages) * 100)
      : 0;

    const [record, created] = await ReadingProgress.findOrCreate({
      where: { student_id: req.user.id, book_id: req.params.bookId },
      defaults: { page_number, total_pages, percent_complete }
    });

    if (!created) {
      await record.update({ page_number, total_pages, percent_complete });
    }

    res.json({ message: 'Progress saved', page_number, percent_complete });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};
