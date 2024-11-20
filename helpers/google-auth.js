const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const googleClientId = process.env.GOOGLE_CLIENT_ID;

const googleClient = new OAuth2Client(googleClientId);

module.exports = googleClient;
