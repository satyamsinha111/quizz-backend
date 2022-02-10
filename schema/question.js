const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionSchema = new Schema({
    question: {
        type: String,
        trim: true,
        required: true
    },
    option1: {
        type: String,
        trim: true,
        required: true
    },
    option2: {
        type: String,
        trim: true,
        required: true
    },
    option3: {
        type: String,
        trim: true,
        required: true
    },
    option4: {
        type: String,
        trim: true,
        required: true
    },
    correctAnswer: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Question', questionSchema);