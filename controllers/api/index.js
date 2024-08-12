// Import just the router express
const router = require('express').Router();

// import the appreciation routes
const { router: appreciationRoutes } = require("./appreciation.js");
router.use("/appreciation", appreciationRoutes);

const { router: userRoutes } = require("./userRoutes.js");
router.use("/user", userRoutes)
// router.use("/users", userRoutes)


module.exports = router;
