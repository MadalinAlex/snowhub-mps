const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ReportSchema = new Schema({
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
    counter: {
        type: Number,
        default: 0,
        required: false
    }
});
module.exports = Report = mongoose.model("report", ReportSchema)