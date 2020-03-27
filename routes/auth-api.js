var express = require('express');
var router = express.Router();
var passport = require('passport')
var user = require('../models/user')
var form = require('../models/form')

router.use(passport.authenticate('bearer', {session: false}))

/* GET users listing. */
router.get('/', async (req, res, next) => {
  res.json('Auth API is responding! You are authenticated!');
});

router.get('/getForms',
    async (req, res, next) => {
    try {
      let results = await form.getForms(req.user)
      res.json(results);
    } catch(error) {
      console.log("Error occurred attempting to Logout |", error);
      res.sendStatus(500)
    }
  })

router.post('/getFormByEmail',
    async (req, res, next) => {
    try {
      let results = await form.getFormByEmail(req.body, req.user)
      res.json(results);
    } catch(error) {
      console.log("Error occurred attempting to Logout |", error);
      res.sendStatus(500)
    }
  })

router.post('/updateFormStatus',
    async (req, res, next) => {
    try {
      // console.log(req.user);
      let results = await form.updateStatus(req.body, req.user)
      res.json(results);
    } catch(error) {
      console.log("Error occurred attempting to Logout |", error);
      res.sendStatus(500)
    }
  })

router.post('/logout',
    async (req, res, next) => {
    try {
      let results = await user.logout(req.user)
      res.json(results);
    } catch(error) {
      console.log("Error occurred attempting to Logout |", error);
      res.sendStatus(500)
    }
  })

module.exports = router