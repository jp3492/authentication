const passport      = require('passport')
const User          = require('../models/user')
const config        = require('../config')
const JwtStrategy   = require('passport-jwt').Strategy
const ExtractJwt    = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')
//Local Strategy checks in your local DB if the pws are matching
const localOpts = { usernameField: 'email' }
const localLogin = new LocalStrategy(localOpts, (email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if (err){ return done(err) }
    if (!user){ return done(null, false) } //when no error but no user found
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err) }
      if (!isMatch) { return done(null, false) }
      return done(null, user)
    })
  })
})
// jwt can be placed anywhere in the request, we need to specify where to attach it
const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey:    config.secret
}
const login = new JwtStrategy(jwtOpts, (payload, done) => {
  User.findById(payload.sub, (err, user) => {
    //second argument of done() would take user if found
    if (err) { return done(err, false) }
    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
})
passport.use(login)
passport.use(localLogin)
