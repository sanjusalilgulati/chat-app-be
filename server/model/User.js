const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }
});
//Set users table name
module.exports = mongoose.model('users', UserSchema);
