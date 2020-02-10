var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  res.render('index', { title: 'KRhuleTaylorJavascript' });
});

router.get('/login', async (req, res, next) => {
  res.render('index', { title: 'KRhuleTaylorJavascript' });
});

router.get('/register', async (req, res, next) => {
  res.render('index', { title: 'KRhuleTaylorJavascript' });
});

router.get('/tasty', async (req, res, next) => {
  res.render('index', { title: 'KRhuleTaylorJavascript' });
});

module.exports = router;
