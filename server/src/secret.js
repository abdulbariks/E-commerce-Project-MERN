require("dotenv").config();
const serverPort = process.env.SERVER_PORT || 3001;
const mongodbURL = process.env.MONGODB_ATLAS_URL || 'mongodb://localhost:27017/ecommerceMERNDB';
const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH || 'public/images/users/Abdul Barik.jpg';

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || 'sjffkgnhjsnsk';

const smtpUsername = process.env.SMTP_USERNAME || '';
const smtpPassword = process.env.SMTP_PASSWORD || '';

const clentURL = process.env.CLIENT_URL || '';


module.exports = {serverPort, mongodbURL, defaultImagePath, jwtActivationKey,
smtpPassword, smtpUsername, clentURL,};