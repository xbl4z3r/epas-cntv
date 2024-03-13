import mongoose, {Schema} from "mongoose";
import ImageSchema from "./image";

const BlogPostSchema = new Schema({
    title: String,
    content: String,
    date: Date,
    tags: [String],
    author: String,
    thumbnail: ImageSchema
});

export default mongoose.model('BlogPost', BlogPostSchema);