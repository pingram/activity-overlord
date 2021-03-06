/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  new: function (req, res) {
    res.view();
  },

  create: function (req, res, next) {

    // users can't be created as admins:
    var userObj = req.params.all();
    delete userObj.admin;

    User.create( userObj, function userCreated (err, user) {
      if (err) {
        console.log(err);

        req.session.flash = {
          err: err.invalidAttributes
        }

        return res.redirect('/user/new');
      }

      req.session.authenticated = true;
      req.session.User = user;

      res.redirect('/user/show/' + user.id);
    });
  },

  show: function (req, res, next) {
    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) return next(err);
      if (!user) return next();
      res.view({
        user: user
      });
    });
  },

  index: function (req, res, next) {
    User.find(function foundUsers (err, users) {
      if (err) return next(err);

      res.view({
        users: users
      });
    });
  },

  edit: function (req, res, next) {
    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) return next(err);
      if (!user) return next("User doesn't exist.");

      res.view({
        user: user
      });
    });
  },

  update: function (req, res, next) {
    var userObj = req.params.all();
    // remove parameters that can only be set by admin:
    if(!req.session.User.admin){
      delete userObj.admin;
    }

    User.update(req.param('id'), req.params.all(), function userUpdated (err) {
      if (err) {
        return res.redirect('/user/edit/' + req.param('id'));
      }

      res.redirect('/user/show/' + req.param('id'));
    });
  },

  destroy: function (req, res, next) {
    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) return next(err);

      if (!user) return next("User doesn't exist.");

      User.destroy(req.param('id'), function userDestroyed (err) {
        if (err) return next(err);
      });

      res.redirect('/user');
    });
  }

};
