const path = require('path');
// Import just the router express
const router = require('express').Router();
// Import the index.js from 'api' folder
const apiRoutes = require('./api');

// you can ignore this logic as i did it just for testing. you can follow what you have. 
router.use('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));
// When a request is made to the /api route, it will be directed to the index.js in the 'api' folder.
router.use('/api', apiRoutes);

// TODO: Implement 404 route for all other paths.
module.exports = router;
