const express = require("express");
const router = express.Router();
const { withAuth } = require('../utils/util');
const { User, Appreciation } = require("../models")
const { getSentUserNotes, getReceivedNotes } = require("./api/appreciation");
const { getUserData } = require("./api/userRoutes");

// / Render the homepage
router.get('/', (req, res) => {
  if (req.session.logged_in) {
    console.log("/ route hit. User logged in redirected to received");
    res.redirect('/received');
    return;
  }
  //TODO: Need Johannes changes for home handelbar
  res.render('home');
});

// Render the registration page
router.get('/register', (req, res) => {
  if (req.session.logged_in) {
    console.log("/register route hit. User logged in redirected to received");
    res.redirect('/received');
    return;
  }
  res.render('register', {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET
  });
});

router.get("/sent", withAuth, async (req, res) => {
  // if (!req.session.logged_in) {
  //   console.log("/sent route hit. User not logged in redirected to home page");
  //   res.redirect('/');
  //   return;
  // }
  // return object
  const data = {
    notes: {},
    user: {}
  };

  // get user id from session object: 
  const user_id = req.session.user_id;

  console.log(`---- Generating sent page for user id: ${user_id} -----`);

  // Get user data for name 
  console.log('----- Getting user data by quering hte User db -----');
  const userDataResponse = await getUserData(user_id);
  console.log("User data from query: ", userDataResponse);
  const firstLetter = userDataResponse.data.firstName.charAt(0);
  const rest = userDataResponse.data.firstName.slice(1)
  data.user.name = firstLetter.toUpperCase() + rest;
  data.user.profileimg = "<div class=\"w-lg-100 p-2 w-md-80 w-sm-100\" id=\"profileImg\" style=\"background-size:cover; background-image:url('" + userDataResponse.data.profileImg + "')\"></div>"


  // Get total sent notes
  console.log(`----- Getting notes sent by user: ${user_id} -----`);
  const sentNoteResponse = await getSentUserNotes(user_id);
  data.user.sent = 0;
  if (sentNoteResponse.success == true) {
    const sentNotes = sentNoteResponse.data;
    const tempNotes = [];
    for (let i = 0; i < sentNotes.length; i++) {
      let entry = sentNotes[i];
      const newNote = {}
      newNote.message = entry.message;
      const mfname = entry.Receiver.firstName.charAt(0).toUpperCase() + entry.Receiver.firstName.slice(1);
      const mlname = entry.Receiver.lastName.charAt(0).toUpperCase() + entry.Receiver.lastName.slice(1);
      const userInfo = "To " + mfname + " " + mlname + " on " +
        (new Date(entry.createdAt))
          .toLocaleString([], {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: 'short'
          });
      newNote.user = userInfo;
      tempNotes.push(newNote);
    }
    sentNoteResponse.data = tempNotes;
    console.log("Sent note response: ", sentNoteResponse);
    data.user.sent = tempNotes.length;
  }
  data.notes = sentNoteResponse;

  // Get total received notes 
  console.log(`----- Getting notes received by user: ${user_id} -----`);
  const rescvNoteResponse = await getReceivedNotes(user_id);
  data.user.received = 0;
  if (rescvNoteResponse.success == true) {
    data.user.received = rescvNoteResponse.data.length
  }
  console.log("Data object being sent to handlebars: ", data);

  // Render  sent notes
  res.render('sent', { data })

});

router.get("/received", withAuth, async (req, res) => {
  // if (!req.session.logged_in) {
  //   console.log("/received route hit. User not logged in redirected to home page");
  //   res.redirect('/');
  //   return;
  // }
  // return object
  const data = {
    notes: {},
    user: {}
  };

  // get user id from session object: 
  const user_id = req.session.user_id;

  console.log(`---- Generating received page for user id: ${user_id} -----`);

  // Get user data for name 
  console.log('----- Getting user data by quering hte User db -----');
  const userDataResponse = await getUserData(user_id);
  console.log("User data from query: ", userDataResponse);
  const firstLetter = userDataResponse.data.firstName.charAt(0);
  const rest = userDataResponse.data.firstName.slice(1)
  data.user.name = firstLetter.toUpperCase() + rest;
  data.user.profileimg = "<div class=\"w-lg-100 p-2 w-md-80 w-sm-100\" id=\"profileImg\" style=\"background-size:cover; background-image:url('" + userDataResponse.data.profileImg + "')\"></div>"

  // Get total sent notes 
  console.log(`----- Getting notes sent by user: ${user_id} -----`);
  const sentNoteResponse = await getSentUserNotes(user_id);
  data.user.sent = 0;
  if (sentNoteResponse.success == true) {
    data.user.sent = sentNoteResponse.data.length
  }

  // Get total received notes
  console.log(`----- Getting notes received by user: ${user_id} -----`);
  const receivedResponse = await getReceivedNotes(user_id);
  data.user.received = 0;
  if (receivedResponse.success == true) {
    const recvNotes = receivedResponse.data;
    const tempNotes = [];
    for (let i = 0; i < recvNotes.length; i++) {
      let entry = recvNotes[i];
      const newNote = {}
      newNote.message = entry.message;
      const mfname = entry.Sender.firstName.charAt(0).toUpperCase() + entry.Sender.firstName.slice(1);
      const mlname = entry.Sender.lastName.charAt(0).toUpperCase() + entry.Sender.lastName.slice(1);
      const userInfo = "From " + mfname + " " + mlname + " on " +
        (new Date(entry.createdAt))
          .toLocaleString([], {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: 'short'
          });

      newNote.user = userInfo;
      tempNotes.push(newNote);
    }
    receivedResponse.data = tempNotes;
    console.log("Received note response: ", receivedResponse);
    data.user.received = tempNotes.length;
  }
  data.notes = receivedResponse;

  console.log("Data object being sent to handlebars: ", data);
  // Render  sent notes
  res.render('received', { data })
});


router.get("/sendthanks", withAuth, async (req, res) => {
  // if (!req.session.logged_in) {
  //   console.log("/sentthanks route hit. User not logged in redirected to home page");
  //   res.redirect('/');
  //   return;
  // }

  const data = {
    notes: {},
    user: {}
  };

  // get user id from session object: 
  const user_id = req.session.user_id;

  console.log(`---- Generating sentthanks page for user id: ${user_id} -----`);

  // Get user data for name 
  console.log('----- Getting user data by quering the User db -----');
  const userDataResponse = await getUserData(user_id);
  console.log("User data from query: ", userDataResponse);
  const firstLetter = userDataResponse.data.firstName.charAt(0);
  const rest = userDataResponse.data.firstName.slice(1)
  data.user.name = firstLetter.toUpperCase() + rest;
  data.user.profileimg = "<div class=\"w-lg-100 p-2 w-md-80 w-sm-100\" id=\"profileImg\" style=\"background-size:cover; background-image:url('" + userDataResponse.data.profileImg + "')\"></div>"

  // Get total received notes 
  console.log(`----- Getting notes received by user: ${user_id} -----`);
  const rescvNoteResponse = await getReceivedNotes(user_id);
  data.user.received = 0;
  if (rescvNoteResponse.success == true) {
    data.user.received = rescvNoteResponse.data.length
  }

  // Get total sent notes 
  console.log(`----- Getting notes sent by user: ${user_id} -----`);
  const sentNoteResponse = await getSentUserNotes(user_id);
  data.user.sent = 0;
  if (sentNoteResponse.success == true) {
    data.user.sent = sentNoteResponse.data.length
  }

  console.log("Data object being sent to handlebars: ", data);
  res.render('sendthanks', { data });
})


module.exports = router;
