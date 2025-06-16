const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Group = require('../models/Group');
const Auth = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

router.post('/new', Auth, checkPermission('create-groups'), async (req, res) => {
    const { Name, Permissions } = req.body;
    console.log(Name, Permissions);
    if (!Name) {
        return res.status(400).send('Name is required');
    }
    
    try {
      const newGroup = new Group({
        name: Name,
        permissions: Permissions || [],
      });

      console.log('New user object:', newGroup);
      await newGroup.save();
      res.status(201).json(newGroup);
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).send('Server error');
    }
});

module.exports = router;