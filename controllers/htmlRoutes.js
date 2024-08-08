const router = require("express").Router();
router.get("/login", (req, res) => {
    try {

        res.render("login");

    } catch (error) {
        if (req.session.logged_in) {
            res.redirect('/userprofile');
            return;
        }

        res.render('login');

    }
});

router.get("/createanaccount", (req, res) => {

    res.render("createaccount");
});

router.get("/userprofile", (req, res) => {

    res.render("userprofile");
});
module.exports = router;

