'use strict';

const { Router } = require('express');
const router = Router();
const User = require('../models/user');
//'./../models/user' wrong path
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Hello World!' });
});

//sign uppp --------------------------------------------------------------------

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, 10)
    .then(hash => {
      return User.create({
        username,
        passwordHash: hash
      });
    })
    .then(user => {
      // req.session.user = {
      //   _id: user._id
      // };
      res.redirect('/private');
    })
    .catch(error => {
      console.log('There was an error in the sign up process.', error);
    });
});


//-----------------------------------------------------------------------------------------


//sign innn --------------------------------------------------------------------

router.get('/signin', (req, res, next) => {
  res.render('signin');
});

router.post('/signin', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  
  let auxiliaryUser;

  User.findOne({ username })
    .then(user => {
      if (!user) {
        throw new Error('USER_NOT_FOUND');
      } else {
        auxiliaryUser = user;
        return bcrypt.compare(password, user.passwordHash);
      }
    })
    .then(matches => {
      if (!matches) {
        throw new Error('PASSWORD_DOESNT_MATCH');
      } else {
        // req.session.user = {
        //   _id: auxiliaryUser._id
        // };
        res.redirect('private');
      }
    })
    .catch(error => {
      console.log('There was an error signing up the user', error);
      next(error);
    });
});

router.get('/private', (req, res, next) => {
  res.render('private');
});


//---------------------------------------------------------------------------------------------

module.exports = router;
