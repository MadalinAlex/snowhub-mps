const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SlopesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    reports: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report" 
    }]
});
module.exports = Slope = mongoose.model("slope", SlopesSchema);