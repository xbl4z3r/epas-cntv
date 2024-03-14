import mongoose, {Schema} from "mongoose";

const TriviaQuestionSchema = new Schema({
    question: String,
    answers: [String],
    correctAnswerIndex: Number,
    category: String,
    difficulty: String
});

const TriviaSessionSchema = new Schema({
    questions: [TriviaQuestionSchema],
    startedAt: Date,
    score: Number,
    progress: Number,
});

export const TriviaQuestion = mongoose.model('TriviaQuestion', TriviaQuestionSchema);
export const TriviaSession = mongoose.model('TriviaSession', TriviaSessionSchema);