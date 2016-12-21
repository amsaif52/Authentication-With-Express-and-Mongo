var express = require('express');
var router = express.Router();
var User = require('../models/user').User;
var mid = require('../middleware/middleware');


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
	  .get(mid.loggedOut,function(req,res,next){
			return res.render('register',{title: 'Register'});
	   })
	  .post(function(req,res,next){
			if(req.body.email && req.body.name && req.body.email && req.body.favoriteBook && req.body.password ){

				if(req.body.password !== req.body.confirmPassword){
					var err = new Error("Passoword Doesn't Match");
					err.status = 400;
					return next(err);
				}

				var UserData = {
					name: req.body.name,
					email: req.body.email,
					favoriteBook: req.body.favoriteBook,
					password: req.body.password
				};

				User.create(UserData,function(err,user){
					if(err){
						return next(err);
					}
					req.session.userId = user._id;
					return res.redirect('/profile');
				});
				
			}else{
				var err = new Error("All Fields Required!");
				err.status = 400;
				return next(err);
			}
	   });

router.get('/profile',function(req,res,next){
	if(!req.session.userId){
		var err = new Error("You are not authorized to view this page");
		err.status = 403;
		return next(err);
	}
	User.findById(req.session.userId)
		.exec(function(err,user){
			if(err){
				return next(err);
			}else{
				return res.render('profile',{title: 'Profile', name: user.name, favorite:user.favoriteBook});
			}
		})
});

router.route('/login')
	  .get(mid.loggedOut,function(req,res,next){
		return res.render('login',{title: 'Login'});
	  })
	  .post(function(req,res,next){
	  	if(req.body.email && req.body.password){
	  		User.authenticate(req.body.email,req.body.password,function(err,user){
	  			if(err || !user){
	  				var err = new Error("Wrong Email or Password");
	  				err.status = 401;
	  				return next(err);
	  			}else{
	  				req.session.userId = user._id;
	  				return res.redirect('/profile');
	  			}
	  		});
	  	}else{
	  		var err = new Error('Email or Password does not Match');
	  		err.status = 401;
	  		return next(err);
	  	}
	  });

router.get('/logout',function(req,res,next){
	if(req.session){
		req.session.destroy(function(err){
			if(err){
				return next(err);
			}else{
				return res.redirect('/');
			}
		})
	}
});

module.exports = router;