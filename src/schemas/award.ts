import mongoose, {Schema} from "mongoose";
import ImageSchema from "./image";

const AwardSchema = new Schema({
    title: String,
    details: String,
    year: String,
    thumbnail: ImageSchema
});

export default mongoose.model('Award', AwardSchema);