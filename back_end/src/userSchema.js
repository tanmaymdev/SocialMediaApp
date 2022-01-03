const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    dob: {
        type: Date,
        required: [true, 'Date of Birth is required']
    },
    zipcode: {
        type: Number,
        required: [true, 'Zip Code is required']
    },
    message: {
        type: String,
        default : ""
    },
    followers: {
        type: [],
        default:[]
    },
    picture: {
        type: String,
        default : ""
    },
    created: {
        type: Date,
        required: [true, 'Created date is required']
    }
})

module.exports = userSchema;