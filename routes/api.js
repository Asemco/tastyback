var express = require('express');
var router = express.Router();
var user = require('../models/user')
var form = require('../models/form')

/* GET users listing. */
router.get('/', async (req, res, next) => {
  res.json('API is responding!');
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
    console.log("Request body:", req)
    let results = await user.register(req.body)
    res.json(results);
  } catch(error) {
    console.log("Error occurred attempting to register |", error);
    res.sendStatus(500)
  }
})

router.post('/submit', async (req, res, next) => {
  try {
    console.log("Request body:", req)
    let results = await form.submitForm(req.body)
    res.json(results);
  } catch(error) {
    console.log("Error occurred attempting to submit the form. |", error);
    res.sendStatus(500)
  }
})

module.exports = router;
