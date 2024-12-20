const {Schema, model, trusted}=require('mongoose');


const TokenSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    refreshToken:{
        type: String,
        required: true
    },
    accessToken:{
        type: String,
        require: true
    }
})


module.exports = model('Token',TokenSchema);