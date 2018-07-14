const bcrypt  = require('bcrypt')
const User    = require('../models/user')
const jwt     = require('jwt-simple')
const config  = require('../config')
//Create token with secret for encryption, save id as subject of token and issued at time: with timestamp
const userToken = user => {
  const iat = new Date().getTime()
  return jwt.encode({ sub: user.id, iat }, config.secret)
}
//req.user is set after requireSignin then this function is called
exports.signin = (req, res, next) => {
  res.send({ token: userToken(req.user) })
}

exports.signup = (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) { return res.status(422).send({ error: 'You must provide both, email and password'}) }
  User.findOne({ email }, (err, user) => {
    if (err){ return next(err) }
    if (user){ return res.status(422).send({ error: 'Email already exists' }) }
    const newUser = new User({ email, password })
    newUser.save( err => {
      if (err){ return next(err) }
      return res.json({ token: userToken(newUser) })
    })
  })
}
