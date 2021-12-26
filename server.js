const express=require('express')
const dotenv = require("dotenv");
dotenv.config();
const bp=require('body-parser')
const cors=require('cors')
const mongoose=require('mongoose')
const User=require('./model/User')

const app=express()
const PORT=process.env.PORT||8000;
const MONGO=process.env.MONGO;
app.use(bp.json())
app.use(cors())
mongoose.connect(MONGO,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
});
mongoose.Promise=global.Promise;
mongoose.connection.once('open',()=>{
    console.log('mongo started')
    app.listen(PORT,function() {
        console.log('listening on port 8000')
    })
}).on('error',(err)=>{
    console.log(err)
})

app.post('/register',(req,res)=>{
    const {name,email,password,plate,longitude,latitude,driver}=req.body;
    const user=new User({
        name,
        email,
        password,
        cars:{
            plate:plate||'',
            longitude:longitude||'',
            latitude:latitude||'',
            driver:driver||''
        }
    })
    user.save().then(user=>{
        res.json(user)
    }).catch(err=>{
        console.log(err)
    })
})

//get all users
app.get('/users',(req,res)=>{
    User.find({}).then(users=>{
        res.json(users)
    }).catch(err=>{
        console.log(err)
    })
})

///get a single user
app.get('/user/:email',(req,res)=>{
    const {email}=req.params;
    User.findOne({email:email}).then(user=>{
        if (user==null) {
            res.json('User Not Found') 
        }
        res.json(user)
    }).catch(err=>{
        console.log(err)
    })
})

//update location
app.post('/update',(req,res)=>{
    const {longitude,email,ind,latitude}=req.body;
    // const longitude=location.split(',')[0]
    // const latitude=location.split(',')[1]
    User.findOne({email:email})
    .then(user=>{
        const cars=user.cars;
        cars[ind].latitude=latitude;
        cars[ind].longitude=longitude;
        user.cars=cars;
        user.save().then(user=>{
            res.send(user)
        }).catch(err=>{
            console.log(err)
        })
    })
   .catch(err=>{
       res.send(err)
   })
  
})

///add cars

app.post('/update/cars',(req,res)=>{
    const {email,longitude,latitude,driver,plate}=req.body;
    User.findOne({email:email})
    .then(user=>{
        const newCar={
            latitude,
            longitude,
            driver,
            plate
        }
        user.cars.push(newCar)
        user.save().then(newUser=>{
            res.send(newUser.cars)
        }).catch(err=>{
            console.log(err)
        })
        
    })
   .catch(err=>{
       res.send(err)
   })
  
})

//find location

app.get('/location/:email',(req,res)=>{
    const {email}=req.params;
    User.findOne({email:email}).then(user=>{
        if (user==null) {
            res.json('User Not Foun') 
        } 
        res.json(user.cars)
    }).catch(err=>{
        console.log(err)
    })
})


// ||'mongodb://localhost/tracker'
