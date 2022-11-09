import express, { response } from "express"
import cors from "cors"
import mongoose from "mongoose"
import bcrypt from "bcryptjs";
import axios from "axios";
import  cheerio  from "cheerio";
import 'dotenv/config'

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())


const URI = process.env.MONGODB_URL;

mongoose.connect(URI , {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected")
})

const jobSchema = new mongoose.Schema({
    username:String,
    tag:String,
    heading:String,
    content: String,
    implink:String
})

const resourceSchema = new mongoose.Schema({
    username:String,
    tag:String,
    heading:String,
    content: String,
    implink:String
})



const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cfusernames:String,
    cfn:String,
    ccusernames:String,
    ccn:String,
    leetusernames:String,
    leetn:String
})

const User = new mongoose.model("User", userSchema)
const Resource = new mongoose.model("Resource", resourceSchema)
const Jobs = new mongoose.model("Jobs", jobSchema)

//Routes
app.post("/login", (req, res)=> {
    const { email, password} = req.body
    User.findOne({ email: email}, (err, user) => {
        if(user){
            if(bcrypt.compareSync(password,user.password) ) {
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
    const { name, email, password,cfusernames,ccusernames,  leetusernames } = req.body
    // console.log(req.body);
    User.findOne({email: email}, (err, user) => {
        if(user){
            res.send({message: "User already registerd"})
        } else {
            
            const user = new User({
                name,
                email,
                password,
                cfusernames,
                cfn:"",
                ccusernames,
                ccn:"",
                leetusernames,
                leetn:""
            })
                        
//   user.ccusernames="https://www.codechef.com/users/"+ccusernames;        
//   user.cfusernames="https://codeforces.com/profile/"+cfusernames;
//   user.leetusernames="https://leetcode.com/"+leetusernames;

        user.password = bcrypt.hashSync(user.password, 10);
            user.save(err => {
                if(err) {
                    res.send(err)
                } else {
                    res.send( { message: "Successfully Registered, Please login now." })
                }
            })
        }
    })
    
})


app.post("/addresource", (req, res)=> {
    const { username,tag,heading,content,implink} = req.body
            const resources = new Resource({
                username,
                tag,
                heading,
                content,
                implink
            })
            resources.save(err => {
                if(err) {
                    res.send(err)
                } else {
                    res.send( { message: "Successfully Content Was Uploaded" })
                }
            })        
})


app.get('/getresources',(req, res)=>{
    Resource.find(function(err,Resource) {
        if (err) {
            console.log(err);
        } else {
            res.json(Resource);
        }
    });
});

app.post("/addjob", (req, res)=> {
    const { username,tag,heading,content,implink} = req.body
            const jobs = new Jobs({
                username,
                tag,
                heading,
                content,
                implink
            })
            jobs.save(err => {
                if(err) {
                    res.send(err)
                } else {
                    res.send( { message: "Successfully Content Was Uploaded" })
                }
            })        
})


app.get('/getjobs',(req, res)=>{
    Jobs.find(function(err,Jobs) {
        if (err) {
            console.log(err);
        } else {
            res.json(Jobs);
        }
    });
});


const PORT=process.env.PORT;

// to deploy
if(process.env.NODE_ENV=="production"){
    app.use(express.static("client/build"));
    const path = require("path");
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(_dirname,'client','build','index.html'));
    })
}

app.listen(PORT,() => {
    console.log('Backend was connected at port ',PORT);
})