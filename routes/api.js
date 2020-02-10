var express = require('express');
var router = express.Router();
var user = require('../models/user')
var messages = require('../models/messages')

/* GET users listing. */
router.get('/', async (req, res, next) => {
  res.send('API is responding!');
});

router.post('/login', async (req, res, next) => {
  try {
    let results = await user.login(req.body)
    res.json(results);
  } catch(error) {
    console.log("Error occurred attempting to login |", error);
    res.sendStatus(500)
  }
})

router.post('/register', async (req, res, next) => {
  try {
    let results = await user.register(req.body)
    res.json(results);
  } catch(error) {
    console.log("Error occurred attempting to register |", error);
    res.sendStatus(500)
  }
})

router.get('/messages',
    async (req, res, next) => {
    try {
      let results = await messages.getMessageList()
      res.json(results);
    } catch(error) {
      console.log("Error occurred attempting to Logout |", error);
      res.sendStatus(500)
    }
  })

module.exports = router;
