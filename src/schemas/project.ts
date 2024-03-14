import mongoose, {Schema} from "mongoose";
import ImageSchema from "./image";

const ProjectSchema = new Schema({
    title: String,
    content: String,
    date: Date,
    thumbnail: ImageSchema
});

export default mongoose.model('Project', ProjectSchema);