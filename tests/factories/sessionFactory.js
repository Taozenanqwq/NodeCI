const Buffer = require('safe-buffer').Buffer
const Keygrip = require('Keygrip')

const keys = require('../../config/keys.js')

module.exports = (user) => {
  const sessionObj = {
    passport: {
      user: user._id.toString()
    }
  }
  const sessionString = Buffer.from(JSON.stringify(sessionObj)).toString('base64')
  const key = new Keygrip([keys.cookieKey])
  const sessionsig = key.sign('session=' + sessionString)
  return { session: sessionString, sig: sessionsig }
}
