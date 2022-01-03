const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const commentSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: [true, 'owner is required']
    },
    text: {
        type: String,
        required: [true, 'text is required']
    }
})
commentSchema.plugin(AutoIncrement, {inc_field: 'commentId'});
module.exports = commentSchema;