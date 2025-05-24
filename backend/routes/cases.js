const express = require('express');
const router = express.Router();
const Case = require('../models/Case');

router.get('/:id', async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) return res.status(404).json({ message: 'Case not found' });
    res.json(caseItem);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
      const deletedCase = await Case.findByIdAndDelete(id);
      if (!deletedCase) {
        return res.status(404).send('Case not found');
      }
      res.status(200).send('Case deleted successfully');
    } catch (err) {
      console.error('Error deleting case:', err);
      res.status(500).send('Server error');
    }
});

module.exports = router;
