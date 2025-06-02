const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const Auth = require('../middleware/auth');

router.get('/:id', async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) return res.status(404).json({ message: 'Case not found' });
    res.json(caseItem);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

router.post('/new', Auth, async (req, res) => {
    const { Name, Desc, Status, Category, Subcategory } = req.body;
    
    if (!Name || !Desc) {
      return res.status(400).send('Name and description are required');
    }

    console.log('Creating case with name:', Name, 'and description:', Desc);
    
    try {
      const newCase = new Case({
        Name,
        Desc,
        Created: new Date(),
        Updated: new Date(),
        Status,
        Category,
        Subcategory
      });

      console.log('New case object:', newCase);
      await newCase.save();
      res.status(201).json(newCase);
    } catch (err) {
      console.error('Error creating case:', err);
      res.status(500).send('Server error');
    }
});

router.post('/edit/:id', Auth, async (req, res) => {
    const { id } = req.params;
    const { Name, Desc } = req.body;

    if (!Name || !Desc) {
      return res.status(400).send('Name and description are required');
    }

    try {
      const updatedCase = await Case.findByIdAndUpdate(id, { Name, Desc }, { new: true });
      if (!updatedCase) {
        return res.status(404).send('Case not found');
      }
      res.status(200).json(updatedCase);
    } catch (err) {
      console.error('Error updating case:', err);
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
