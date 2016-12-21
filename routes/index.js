var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
	return res.render('index',{title: 'Home'});
});

router.get('/about',function(req,res,next){
	return res.render('about',{title: 'About'});
});

router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

router.route('/register')
	  .get(function(req,res,next){
			return res.render('register',{title: 'Register'});
	   })
	  .post(function(req,res,next){
			
	   });

module.exports = router;