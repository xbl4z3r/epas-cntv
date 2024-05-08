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
    name: String,
    startedAt: Date,
    finishedAt: Date || null,
    score: Number,
    progress: Number,
});

export const TriviaQuestion = mongoose.model('TriviaQuestion', TriviaQuestionSchema);
export const TriviaSession = mongoose.model('TriviaSession', TriviaSessionSchema);