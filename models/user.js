var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
	name: {type: String, required: true, trim: true},
	email: {type: String, required: true, trim: true, unique: true},
	favoriteBook: {type: String,required: true, trim: true},
	password: {type: String, required: true}
});

UserSchema.statics.authenticate = function(email,password,cb){
	console.log(this);
	this.findOne({email:email})
		.exec(function(err, user){
			if(err){
				return cb(err)
			}else if(!user){
				var err = new Error("User not Found!");
				err.status = 401;
				return cb(err);
			}else{
				bcrypt.compare(password,user.password,function(err,result){
					if(result === true){
						return cb(null,user);
					}else{
						return cb();
					}
				})
			}
		});
}

UserSchema.pre('save',function(next){
	var user = this;
	bcrypt.hash(user.password,10,function(err,hash){
		if(err){
			return next(err);
		}
		user.password = hash;
		return next();
	});
});

var User = mongoose.model("User",UserSchema);
module.exports.User = User;
