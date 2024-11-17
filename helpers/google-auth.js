const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(config.google_auth.clientID);

module.exports = googleClient;