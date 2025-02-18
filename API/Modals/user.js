import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true,
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,
    },
    profilePicture:{
        type:String,
        default: 'https://static-00.iconduck.com/assets.00/profile-default-icon-1024x1023-4u5mrj2v.png' 
    },
},
{timestamps:true});

const User = mongoose.model('User', userSchema);

export default User

