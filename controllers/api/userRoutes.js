const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt');
// const withAuth = require('../../utils/auth'); 


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


// GET /users/:id - Get user by ID
router.get('/:id',  async (req, res) => {
  console.log('GET /:id route hit');
  try {
    console.log(`Fetching user with ID: ${req.params.id}`)
    const userData = await User.findByPk(req.params.id, {
      attributes: [
        ['firstName', 'firstName'], 
        ['lastName', 'lastName'], 
        'emailId',
        'profileImg',
      ],
    });

    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }

    const user = userData.get({ plain: true });

    res.render('profile', { user, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});

// If a POST request is made to /api/users/logout, the function checks the logged_in state in the request.session object and destroys that session if logged_in is true.
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});


module.exports = router;
