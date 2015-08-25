module.exports = function (req, res, next) {
  var sessionUserMatchesId = req.session.User.id === req.param('id');
  var isAdmin = req.session.User.admin;

  if (!sessionUserMatchesId && !isAdmin) {
    var noRightsError = [{ name: 'noRightsError', message: 'You must be an admin.' }];
    req.session.flash = {
      err: noRightsError
    };
    res.redirect('/session/new');
    return;
  }

  next();
};
