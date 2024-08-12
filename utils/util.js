// Checks if req.session.loggedIn is set if not, it redirects the user to the login page.

const withAuth = (req, res, next) => {
  // console.log('withAuth middleware hit');
  // console.log('Session Data:', req.session);
  if (!req.session || !req.session.logged_in) {
    console.log('[Middlewear] Redirecting to login page');
    res.redirect('/#login');
  } else {
    next();
  }
};

// Implemented middle wear to ensure user does not try to update the unallowed fields
const immutableFields = ['SenderId', "id", "ReceiverId", 'createdAt', 'updatedAt'];

// Middleware to filter out immutable fields
function filterImmutableFields(req, res, next) {
  withAuth(req, res, next);
  immutableFields.forEach(field => {
    if (req.body[field] !== undefined) {
      delete req.body[field];
    }
  });
  next();
};


module.exports = {
  withAuth,
  filterImmutableFields
}