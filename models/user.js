var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
				return cb(null,user);
			}
		});
}

var User = mongoose.model("User",UserSchema);
module.exports.User = User;
