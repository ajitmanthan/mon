
const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema({
    user_profile: { type: String, required: true },
    user_email: { type: String, required: true },
    user_pass: { type: String, required: true },
    user_name: { type: String, required: true },
    user_number: { type: String, required: true },
    user_role: { type: String, default: 'user' },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true }
  });
  
  const Signup = mongoose.model('Signup', signupSchema);
  module.exports = Signup;
  