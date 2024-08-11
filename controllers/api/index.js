// Import just the router express
const router = require('express').Router();

// import the appreciation routes
const appreciationRoutes = require("./appreciation.js");
router.use("/appreciation", appreciationRoutes);

const userRoutes = require("./userRoutes.js");
router.use("/user", userRoutes)
router.use("/users", userRoutes)

module.exports = router;
