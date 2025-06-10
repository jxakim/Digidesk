const geoip = require('geoip-lite');
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Case = require('../models/Case');
const Auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 },
});

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

    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const location = geoip.lookup(ipAddress);

    console.log('Creating case with name:', Name, 'and description:', Desc);
    console.log('User IP Address:', ipAddress);
    console.log('User Location:', location);
    
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

router.put('/:id', upload.array('Images', 10), async (req, res) => {
  try {
    const { Name, Desc, Status, Category, Subcategory, Updated, ExistingImages } = req.body;

    const existingImages = Array.isArray(ExistingImages) ? ExistingImages : [ExistingImages];
    const newImages = req.files.map((file) => `/uploads/${file.filename}`);
    const allImages = [...existingImages, ...newImages];

    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      {
        Name,
        Desc,
        Status,
        Category,
        Subcategory,
        Updated,
        Images: allImages,
      },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).send('Case not found');
    }

    res.json(updatedCase);
  } catch (err) {
    console.error('Error updating case:', err);
    res.status(500).send('Server error');
  }
});

router.delete('/images/:id', async (req, res) => {
  const { id } = req.params;
  const { imagePath } = req.body;

  try {
    const caseItem = await Case.findById(id);
    if (!caseItem) {
      return res.status(404).send('Case not found');
    }

    caseItem.Images = caseItem.Images.filter((img) => img !== imagePath);
    await caseItem.save();

    const fullPath = path.join(__dirname, '..', imagePath);
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(`Error deleting file ${fullPath}:`, err);
      }
    });

    res.status(200).send('Image deleted successfully');
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).send('Server error');
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const caseItem = await Case.findById(id);
    if (!caseItem) {
      return res.status(404).send('Case not found');
    }

    // Remove associated images from the uploads directory
    if (caseItem.Images && Array.isArray(caseItem.Images)) {
      caseItem.Images.forEach((imagePath) => {
        if (typeof imagePath === 'string' && imagePath.trim() !== '') { // Validate imagePath
          const fullPath = path.join(__dirname, '..', imagePath); // Resolve full path
          fs.unlink(fullPath, (err) => {
            if (err) {
              console.error(`Error deleting file ${fullPath}:`, err);
            } else {
              console.log(`Deleted file: ${fullPath}`);
            }
          });
        } else {
          console.warn(`Invalid image path skipped: ${imagePath}`);
        }
      });
    }

    // Delete the case from the database
    const deletedCase = await Case.findByIdAndDelete(id);
    res.status(200).send('Case and associated images deleted successfully');
  } catch (err) {
    console.error('Error deleting case:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
