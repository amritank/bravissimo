// Import just the router express
const router = require('express').Router();

// import the appreciation routes
const appreciationRoutes = require("./appreciation.js");
router.use("/appreciation", appreciationRoutes);

module.exports = router;
