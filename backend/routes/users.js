const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const User = require('../models/User');
const Auth = require('../middleware/auth');

router.post('/new', Auth, async (req, res) => {
    const { Username, Password, Group } = req.body;
    
    if (!Name || !Desc) {
      return res.status(400).send('Username and password are required');
    }
    
    try {
      const newUser = new User({
        Username,
        Password,
        Group,
      });

      console.log('New user object:', newUser);
      await newUser.save();
      res.status(201).json(newUser);
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).send('Server error');
    }
});