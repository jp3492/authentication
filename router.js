const auth            = require('./control/auth')
const passportService = require('./services/passport')
const passport        = require('passport')

const requireAuth     = passport.authenticate('jwt', { session: false })
const requireSignin   = passport.authenticate('local', { session: false })

module.exports = app => {
  //on every request require the requireAuth function
  app.get('/', requireAuth, (req, res) => {
    res.send({ hi: 'there' })
  })
  app.post('/signin', requireSignin, auth.signin)
  app.post('/signup', auth.signup)
}
