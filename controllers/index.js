// Import just the router express
const router = require('express').Router();
// Import the index.js from 'api' folder
const apiRoutes = require('./api');

// you can ignore this logic as i did it just for testing. you can follow what you have. 
// TODO: REMOVE
router.use('/profile', (req, res) => res.sendFile("/Users/amritanair/git/bravissimo/public/pages/profile.html"));
router.use('/img_upload', (req, res) => res.sendFile("/Users/amritanair/git/bravissimo/public/pages/cloudinary.html"));

// TODO: END REMOVE
// router.use('/profile', (req, res) => res.send({msg: "here"}));
// When a request is made to the /api route, it will be directed to the index.js in the 'api' folder.
router.use('/api', apiRoutes);
router.use('/', (req, res) => res.sendFile("/Users/amritanair/git/bravissimo/public/pages/index.html"));

// TODO: Implement 404 route for all other paths.
module.exports = router;
