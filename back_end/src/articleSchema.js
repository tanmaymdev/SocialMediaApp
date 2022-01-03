const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const articleSchema = new mongoose.Schema({
    auth: {
        type: String,
        required: [true, 'author is required']
    },
    text : {
        type : String,
        required: [true, 'text is required']
    },
    image : {
        type : String,
    },
    date: {
        type: Date,
        required: [true, 'date is required']
    },
    comments: {
        type: Array,
    }
})
articleSchema.plugin(AutoIncrement, {inc_field: 'pid'});
module.exports = articleSchema;