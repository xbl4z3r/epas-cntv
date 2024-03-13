import {Schema} from "mongoose";

const ImageSchema = new Schema({
    data: String,
    contentType: String
});

export default ImageSchema;