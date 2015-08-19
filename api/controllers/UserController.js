/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
  'new': function (req, res) {
    res.locals.flash = _.clone(req.session.flash);
    req.session.flash = {};
    res.view();
  },

  create: function (req, res, next) {

    User.create( req.params.all(), function userCreated (err, user) {
      if (err) {
        console.log(err);

        req.session.flash = {
          err: err.invalidAttributes
        }

        return res.redirect('/user/new');
      }

      req.session.flash = {};
      res.json(user);
    });
  }

};
