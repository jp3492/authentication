const mongoose    = require('mongoose')
const bcrypt      = require('bcrypt-nodejs')
const Schema      = mongoose.Schema

const UserSchema  = new Schema({
  email: {
    type:      String,
    unique:    true,
    required:  true,
    lowercase: true
  },
  password: String
})
//Always use non arrow function to be able to reference this, otherwise referncing globals
UserSchema.pre('save', function(next) {
  const user = this
  bcrypt.genSalt(10, (err, salt) => {
    if (err){ return next(err) }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err) }
      user.password = hash
      next()
    })
  })
})
//Everytime i create a new user it has access to this defined methods object
UserSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return callback(err) }
    //if there is no error, send if password isMatch or not
    callback(null, isMatch)
  })
}

const User        = mongoose.model('user', UserSchema)
module.exports    = User
