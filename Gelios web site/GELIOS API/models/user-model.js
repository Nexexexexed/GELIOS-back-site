const {Schema, model}=require('mongoose');
const mongoose = require('mongoose');


const CartSchema = new Schema(
    {    
        "kaskoq" :{
            type: Number,
            default: 0,
        },
        "osagoq" : {
            type: Number,
            default: 0,
        },
        "anticlimax" : {
            type: Number,
            default: 0,
        },
        "accidentq" : {
            type: Number,
            default: 0,
        },
        "allforbuizq" : {
            type: Number,
            default: 0,
        },
        "allforyouq" : {
            type: Number,
            default: 0,
        },
        "doctorq" : {
            type: Number,
            default: 0,
        },
        "homehouseq" : {
            type: Number,
            default: 0,
        },
        "mortgageq" : {
            type: Number,
            default: 0,
        },
        "sportsmanq" : {
            type: Number,
            default: 0,

        },
        "touristq" : {
            type: Number,
            default: 0,
        },
    }
)



const UserSchema = new Schema({
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    isActivated:{
        type: Boolean,
        default: false
    },
    activationLink:{
        type: String
    },
    country:{
        type: String,
        require: false
    },
    name:{
        type: String,
        require: false
    },
    surname:{
        type: String,
        require: false 
    },
    passportNum:{
        type: String,
        require: false 
    },
    passportSer:{
        type: String,
        require: false 
    },
    cart: {type: CartSchema, default: ()=>({})}
})


module.exports = model('User',UserSchema);