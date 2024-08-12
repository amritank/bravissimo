const express = require("express");
const router = express.Router();
const withAuth = require('../utils/auth');
const { User, Appreciation } = require("../models")


  // / Render the homepage
router.get('/', (req, res) => {
  res.render('home', {
    logged_in: req.session.loggedIn,
    userId:req.session.user?.id,
  });
});

// Render the login page
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('home');
});

// Render the registration page
router.get('/register', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/profile');
    return;
  }
  res.render('register', {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET
  });
});

// Render the user profile page, protected by withAuth middleware
router.get('/profile', withAuth, (req, res) => {
  res.render('profile', {
    user: req.session.user,
    logged_in: req.session.loggedIn,
  });
});

  
  module.exports = router;
 