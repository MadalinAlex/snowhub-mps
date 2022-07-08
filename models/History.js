const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const HistorySchema = new Schema({
    type: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    time : { 
        type : Date,
        default: Date.now 
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
    slopeName: {
        type: String,
        required: true,
    }
});
module.exports = History = mongoose.model("history", HistorySchema)