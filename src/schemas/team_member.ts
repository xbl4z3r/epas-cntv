import mongoose, {Schema} from "mongoose";
import ImageSchema from "./image";

const TeamMemberSchema = new Schema({
    name: String,
    class: String,
    social: String,
    picture: ImageSchema
});

export default mongoose.model("TeamMember", TeamMemberSchema);