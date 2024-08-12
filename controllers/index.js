// Import just the router express
const router = require('express').Router();
// Import the index.js from 'api' folder
const apiRoutes = require('./api');
const homeRoutes = require("./homeRoutes");

router.get("/sessiondata", (req, res) => {
  res.json(req.session);
});

router.use("/", homeRoutes);
// When a request is made to the /api route, it will be directed to the index.js in the 'api' folder.
router.use('/api', apiRoutes);

// TODO: Implement 404 route for all other paths.
router.get("*", (req, res) => {
  res.render("404");
})

module.exports = router;
