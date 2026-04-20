import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    body : {
        type : String,
        required: true,
    },
    likes : {
        type : Number,
        
    },
    createdAt : {
        type : Date,
        default : new Date()

    },
    updatedAt : {
        type : Date,
        default : new Date(),
    },
    media : {
        type:String,
        default :"",
    },
    active : {
        type : Boolean,
        default : true
    },
    fileType :  {
        type : String,
        default : "",
    }
});

export const Post = mongoose.model("Post",postSchema);