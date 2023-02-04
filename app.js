const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); 
const md5 = require("md5"); //for Hasing.
const app = express();
const path = require("path");
app.use(express.json());
app.use(express.urlencoded());
app.use(cors())


//static files
app.use(express.static(path.join(__dirname,"../front-end/build")));
app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,"../front-end/build/index.html"))
});

mongoose.connect("mongodb+srv://Admin-Rachit:Atlas@cluster0.ur4pnxy.mongodb.net/AdrixusDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected")
})

const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

//Routes
app.post("/login", (req, res)=> {
    const { email, password} = req.body
    User.findOne({ email: email}, (err, user) => {
        if(user){
            if(md5(password) === user.password ) {
                res.send({message: "Login Successfull", user: user})
            } else {
                res.send({ message: "Password didn't match"})
            }
        } else {
            res.send({message: "User not registered"})
        }
    })
}) 

app.post("/register", (req, res)=> {
    // console.log("test1");
    const { fname, lname, email, password} = req.body
    User.findOne({email: email}, (err, user) => {
        if(user){
            res.send({message: "User already registerd"})
        } else {
            const user = new User({
                fname,
                lname,
                email,
                password: md5(password)
                // password
            })
            user.save(function(err){
                if(err) {
                    // console.log("error:hit ");
                    res.send(err)
                } else {
                    // console.log("error:hit ");
                    res.send( { message: "Successfully Registered, Please login now." })
                }
            })
        }
    })
    
}) 


app.get("/",function(req,res){
    res.send("Server is responding");
});


app.listen(9002,function(){
    console.log("Server Started");
});