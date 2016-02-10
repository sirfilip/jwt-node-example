var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema =new Schema({
  name: String,
  password: String,
  admin: Boolean
});

UserSchema.statics.all = function() {

  return new Promise(function(resolve, reject) {
    
    this.find({}).select({name: 1}).exec(function(err, users) {
      if (err) {
        reject(err);
      } else {
        resolve(users);
      }
    });
  
  }.bind(this));

};

module.exports = mongoose.model('User', UserSchema);
