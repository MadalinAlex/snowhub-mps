const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const InteractionsSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    report_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
        required: true 
    },
    isLike: {
        type: Boolean,
        required: true
    }
});
module.exports = Interaction = mongoose.model("interaction", InteractionsSchema);