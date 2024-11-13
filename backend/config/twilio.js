const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio Account SID from .env
const authToken = process.env.TWILIO_AUTH_TOKEN; // Twilio Auth Token from .env

const client = new twilio(accountSid, authToken);

module.exports = client;
