const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt');
const { withAuth } = require('../../utils/util');
// const withAuth = require('../../utils/auth'); 

async function getUserData(user_id) {
  try {
    console.log(`Fetching user with ID: ${user_id}`)
    const userData = await User.findByPk(user_id, {
      attributes: [
        ['firstName', 'firstName'],
        ['lastName', 'lastName'],
        'emailId',
        'profileImg',
      ],
    });

    console.log("User data as: " + JSON.stringify(userData));
    if (!userData) {
      return { success: true, data: [], status: 404 };
    }

    return { success: true, data: userData, status: 200 };

  } catch (err) {
    console.log(`Error while requesting user data. ${err}`)
    return { success: false, error: err, status: 500 }; // Error occurred
  };

}

router.post('/register', async (req, res) => {
  try {
    const userData = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
      password: req.body.password,
      profileImg: req.body.profileImg,
    });

    req.session.save(() => {
      req.session.userId = userData.id;
      req.session.loggedIn = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      res.status(400).json({ message: 'Please provide both email and password.' });
      return;
    }

    const userData = await User.findOne({ where: { emailId: emailId } });

    if (!userData) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }



    const validPassword = await bcrypt.compare(password, userData.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }
    console.log(userData)
    req.session.save(() => {
      req.session.logged_in = true;
      req.session.user_id = userData.id;
      console.log(userData)

      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// GET /user - Get user by ID
router.get('/:id', withAuth, async (req, res) => {
  console.log('GET /:id route hit');

  if (!req.session.user_id) {
    return res.status(400).json({ msg: "You must be logged in first!" })
  }

  let user_id = req.params.id;
  const response = await getUserData(user_id);
  return res.status(response.status).json(response);

});


// GET /users and return only first name and last name for auto complete
router.get('/', async (req, res) => {
  console.log('GET all users route hit');

  if (!req.session.user_id) {
    return res.status(400).json({ msg: "You must be logged in first!" })
  }

  try {
    console.log(`Fetching all users`)
    const userData = await User.findAll({
      attributes: ['firstName', 'lastName']
    });

    if (!userData) {
      res.status(404).json({ message: "No users found" });
      return;
    }
    const firstNames = userData.map((ele) => ele.firstName + " " + ele.lastName);
    res.json(firstNames);
  } catch (err) {
    res.status(500).json(err);
  }
});



// // If a POST request is made to /api/users/logout, the function checks the logged_in state in the request.session object and destroys that session if logged_in is true.
// router.post('/logout', (req, res) => {
//   if (req.session.logged_in) {
//     req.session.destroy(() => {
//       res.status(204).end();
//     });
//   } else {
//     res.status(404).end();
//   }
// });

router.delete('/logout', (req, res) => {
  console.log('Session', req.session);
  if (req.session.logged_in) {
    console.log('Session exists, attempting to destroy');
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = { router, getUserData };
