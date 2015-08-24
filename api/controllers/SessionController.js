/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcrypt');

module.exports = {

  new: function (req, res) {
    res.view();
  },

  create: function (req, res, next) {
    if (!req.param('email') || !req.param('password')) {
      var usernamePasswordRequiredError = [{ name: 'usernamePasswordRequired', message: 'You must enter both a username and a password.'}];

      req.session.flash = {
        err: usernamePasswordRequiredError
      };

      res.redirect('/session/new');
      return;
    }


    User.findOneByEmail(req.param('email')).exec(function (err, user) {
      if (err) return next(err);

      if (!user) {
        var noAccountError = [{ name: 'noAccount', message: 'The email address ' + req.param('email') + ' was not found.' }];
        req.session.flash = {
          err: noAccountError
        }
        res.redirect('/session/new');
        return;
      }

      bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid) {
        if (err) return next(err);

        if (!valid) {
          var usernamePasswordMismatchError = [{ name: 'usernamePasswordMismatchError', message: 'Invalid username and password combination.' }];
          req.session.flash = {
            err: usernamePasswordMismatchError
          }
          res.redirect('/session/new');
          return;
        }

        req.session.authenticated = true;
        req.session.User = user;

        res.redirect('/user/show/' + user.id);
      });
    });
  },

  destroy: function (req, res, next) {
    req.session.destroy();
    res.redirect('/session/new');
  }

};
