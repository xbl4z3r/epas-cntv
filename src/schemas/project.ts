import mongoose, {Schema} from "mongoose";

const ProjectSchema = new Schema({
    title: String,
    content: String,
    date: String
});

export default mongoose.model('Project', ProjectSchema);