// Checks if req.session.loggedIn is set if not, it redirects the user to the login page.

const withAuth = (req, res, next) => {
    // console.log('withAuth middleware hit');
    // console.log('Session Data:', req.session);
    if (!req.session || !req.session.logged_in) {
        console.log('Redirecting to /login'); 
      res.redirect('/login');
    } else {
      next();
    }
  };

module.exports = withAuth;