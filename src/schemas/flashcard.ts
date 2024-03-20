import mongoose, {Schema} from "mongoose";

const FlashcardSchema = new Schema({
    question: String,
    answer: String
});

export const Flashcard = mongoose.model('Flashcard', FlashcardSchema);