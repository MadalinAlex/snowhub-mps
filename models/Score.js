const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ScoreSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
    score: {
        type: Number,
        default: 0
    }
});
module.exports = Score = mongoose.model("score", ScoreSchema);