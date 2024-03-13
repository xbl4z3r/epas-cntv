import mongoose, {Schema} from "mongoose";

const TriviaQuestionSchema = new Schema({
    question: String,
    answers: [String],
    correctAnswer: String,
    category: String,
    difficulty: String
});

export default mongoose.model('TriviaQuestion', TriviaQuestionSchema);