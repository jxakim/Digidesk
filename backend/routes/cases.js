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

router.post('/new', async (req, res) => {
    const { Name, Desc } = req.body;
    
    if (!Name || !Desc) {
      return res.status(400).send('Name and description are required');
    }

    console.log('Creating case with name:', Name, 'and description:', Desc);
    
    try {
      const newCase = new Case({ Name, Desc });
      await newCase.save();
      res.status(201).json(newCase);
    } catch (err) {
      console.error('Error creating case:', err);
      res.status(500).send('Server error');
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
