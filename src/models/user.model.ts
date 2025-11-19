import mongoose from 'mongoose';




const UserSchema = new mongoose.Schema({
    email : {
        type: String,
        unique : true,
        required : true,
        trim : true
    },
    password :{
        type : String,
        required : true,
    }
}, {
    timestamps: true,
    _id : false
})



const UserModel = mongoose.model('user', UserSchema);

export default UserModel;
