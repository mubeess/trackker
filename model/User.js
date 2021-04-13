const mongoose=require('mongoose')

const CarsSchema=mongoose.Schema({
    plate:{type:String,default:'12345'},
    longitude:{type:String,default:'0.22'},
    latitude:{type:String,default:'0.22'},
    driver:{type:String,default:''}

})

const UserSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    cars:[CarsSchema]
})

const User=mongoose.model('user',UserSchema)
module.exports=User;