var express = require('express');
var router = express.Router();
var passport = require('passport')
var user = require('../models/user')
var messages = require('../models/messages')

router.use(passport.authenticate('bearer', {session: false}))

/* GET users listing. */
router.get('/', async (req, res, next) => {
  res.json(['Auth API is responding! You are authenticated!']);
});

router.get('/messages',
    async (req, res, next) => {
    try {
      let results = await messages.getMessageList(req.user)
      res.json(results);
    } catch(error) {
      console.log("Error occurred attempting to Logout |", error);
      res.sendStatus(500)
    }
  })


router.post('/create-message',
    async (req, res, next) => {
    try {
      let results = await messages.createMessage(req.body, req.user)
      res.json(results);
    } catch(error) {
      console.log("Error occurred attempting to Logout |", error);
      res.sendStatus(500)
    }
  })

router.post('/express-feelings',
    async (req, res, next) => {
    try {
      // console.log(req.user);
      let results = await messages.expressFeelings(req.body, req.user)
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