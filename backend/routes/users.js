const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const User = require('../models/User');
const Auth = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

router.post('/new', Auth, checkPermission('create-users'), async (req, res) => {
    const { Username, Password, Group } = req.body;
    if (!Username || !Password || !Group) {
      return res.status(400).send(Username, Password, Group);
    }
    
    try {
      const newUser = new User({
        username: Username,
        password: Password,
        group: Group || 'Default',
      });

      console.log('New user object:', newUser);
      await newUser.save();
      res.status(201).json(newUser);
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).send('Server error');
    }
});

router.get('/permissions', Auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('group');

    if (!user || !user.group) {
      return res.status(403).json({ error: 'Access denied: No group assigned' });
    }

    res.status(200).json(user.group.permissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;