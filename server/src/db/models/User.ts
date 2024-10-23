import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        minlength: 3,
        maxLength: 20,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

export default mongoose.model('User', userSchema)