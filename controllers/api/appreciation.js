const router = require("express").Router();
const { Appreciation, User } = require("../../models");
const { withAuth, filterImmutableFields } = require('../../utils/util.js');

// // route to Get all appreciation notes
// router.get("/", async (req, res) => {
//     //TODO: Check user is logged in
//     if (!req.session.logged_in) {
//         return res.status(400).json({ msg: "You must be logged in first!" })
//     }

//     try {
//         console.log(`Querying for an appreciation note with id: ${req.params.id}`);
//         const data = await Appreciation.findAll();
//         console.log("Recieved appreciation note as: " + JSON.stringify(data));
//         res.status(200).json(data);

//     } catch (err) {
//         console.log(`Error while requesting an apreciation note. ${err}`)
//         res.status(500).json({ msg: `Error while requesting an appreciation note. Err: ${err}` });
//     };
// });

// router to post a new thank you route
router.post("/", async (req, res) => {
    //TODO: REVERT
    // if (!req.session.logged_in) {
    //     return res.status(400).json({ msg: "You must be logged in first!" })
    // }

    try {
        const data = await Appreciation.create({
            //TODO: REVERT
            // SenderId: req.session.user.id,
            // ReceiverId: req.body.receiver_id,
            // message: req.body.message
            SenderId: req.body.sender_id,
            ReceiverId: req.body.receiver_id,
            message: req.body.message
        });
        console.log("Recieved data from the post appreciation call as: " + JSON.stringify(data));
        res.status(200).json(data);

    } catch (err) {
        console.log(`Error while posting an apreciation note. ${err}`)
        res.status(500).json({ msg: `Error while posting an appreciation note. Err: ${err}` });
    };

});

// route to get appreciation notes received by an user
router.get("/received/user/:id", async (req, res) => {
    //Check user is logged in
    if (!req.session.logged_in) {
        return res.status(400).json({ msg: "You must be logged in first!" })
    }

    // let user_id = req.session.user_id;
    let user_id = req.params.id;

    try {
        console.log(`Querying appreciation notes received by user with id ${user_id}`);
        const data = await Appreciation.findAll({
            include: [{ model: User, as: "Sender" }],
            order: [['createdAt', 'DESC']],
            where: {
                ReceiverId: user_id
            }
        });
        console.log("Recieved appreciation notes received data as: " + JSON.stringify(data));
        if (data.length == 0) {
            return res.status(404).json({ msg: `No appreciation note found for the receiver with user id: ${user_id}` });
        }
        res.status(200).json(data);

    } catch (err) {
        console.log(`Error while requesting received notes by user. ${err}`)
        res.status(500).json({ msg: `Error while retrieving recieved notes by user. Err: ${err}` });
    };
});

// route to get appreciation notes sent by an user
router.get("/sent/user/:id", async (req, res) => {
    //Check user is logged in
    if (!req.session.logged_in) {
        return res.status(400).json({ msg: "You must be logged in first!" })
    }

    let user_id = req.params.id;//req.session.user_id;

    try {
        console.log(`Querying appreciation notes sent by user with id ${user_id}`);
        const data = await Appreciation.findAll({
            include: [{ model: User, as: "Receiver" }],
            order: [['createdAt', 'DESC']],
            where: {
                SenderId: user_id
            }
        });
        console.log("Recieved appreciation notes sent data as: " + JSON.stringify(data));
        if (data.length == 0) {
            return res.status(404).json({ msg: `No appreciation note found for the sender with user id: ${user_id}` });
        }
        res.status(200).json(data);

    } catch (err) {
        console.log(`Error while requesting sent notes by user. ${err}`)
        res.status(500).json({ msg: `Error while retrieving sent notes by user. Err: ${err}` });
    };
});

//route get an appreciation note by id
router.get("/:id", async (req, res) => {
    //Check user is logged in
    if (!req.session.logged_in) {
        return res.status(400).json({ msg: "You must be logged in first!" })
    }
    try {
        console.log(`Querying for an appreciation note with id: ${req.params.id}`);
        const data = await Appreciation.findByPk(req.params.id);
        console.log("Recieved appreciation note as: " + JSON.stringify(data));
        if (!data) {
            return res.status(404).json({ msg: "No appreciation note found with that id" });
        }
        res.status(200).json(data);

    } catch (err) {
        console.log(`Error while requesting an apreciation note. ${err}`)
        res.status(500).json({ msg: `Error while requesting an appreciation note. Err: ${err}` });
    };
});

// route to delete appreciation notes received by an user
router.delete("/:id", async (req, res) => {
    //Check user is logged in
    if (!req.session.logged_in) {
        return res.status(400).json({ msg: "You must be logged in first!" })
    }

    try {
        let id = req.params.id;
        console.log(`Deleting appreciation note  with id ${id}`);
        const data = await Appreciation.destroy({
            where: {
                id: id
            }
        });
        console.log("Return data post delete: " + JSON.stringify(data));
        if (!data) {
            return res.status(404).json({ msg: "No appreciation note found with that id" });
        }
        res.status(200).json(data);

    } catch (err) {
        console.log(`Error while deleting note. ${err}`)
        res.status(500).json({ msg: `Error while deleting note. Err: ${err}` });
    };
});


// Put call to edit an note
router.put("/:id", filterImmutableFields, async (req, res) => {
    //Check user is logged in
    if (!req.session.logged_in) {
        return res.status(400).json({ msg: "You must be logged in first!" })
    }

    try {
        let id = req.params.id;
        console.log(`Updating appreciation note  with id ${id}`);
        const data = await Appreciation.update(req.body, {
            where: {
                id: id
            }
        });
        console.log("Return data post update: " + JSON.stringify(data));
        if (!data[0]) {
            return res.status(404).json({ msg: "No appreciation note found with that id to update!" });
        }
        res.status(200).json(data);

    } catch (err) {
        console.log(`Error while updating note. ${err}`)
        res.status(500).json({ msg: `Error while updating note. Err: ${err}` });
    };

});


module.exports = router;

