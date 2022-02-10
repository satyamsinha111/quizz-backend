const mongoose = require("mongoose");
const { Schema } = mongoose;

const leaderboardSchema = new Schema({
    username: {
        type: String,
        trim: true
    },
    score: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("Leaderboard", leaderboardSchema);