var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    res.render('index');
    res.sendFile(path.join(__dirname, '/index.html'));
  } catch (err) {
    res.write("Failed");
  }
});

router.get('/login', async (req, res, next) => {
  res.render('index');
});

router.get('/register', async (req, res, next) => {
  res.render('index');
});


module.exports = router;
