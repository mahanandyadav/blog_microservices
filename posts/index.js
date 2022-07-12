const express =require('express')
const {randomBytes}=require('crypto')
const axios=require('axios')
const bodyParser=require('body-parser')
const app =express()
app.use(express.json())
app.use(bodyParser.json())
let posts={}

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Credentials", 'true')//true as string
    // res.header('Access-Control-Expose-Headers',
    // 'Date, Etag, Access-Control-Allow-Origin, Set-Cookie, Access-Control-Allow-Credentials')
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET,PATCH,POST,DELETE");
        return res.status(200).send()
    }
    next();
})
app.get('/posts',(req,res)=>{
    res.send(posts)
})
app.post('/posts',async(req,res)=>{
    const id=randomBytes(4).toString('hex')
    const {title}=req.body
    posts[id]={
        id,title
    }
   await axios.post('http://localhost:4005/events',{
        type:'PostCreated',
        data:{
            id,title
        }
    }).catch((err) => {
        console.log(`==============in posts->send {id,title} to event bus======================`);
        console.log(err.message);
        console.log(`====================================`);
    })
    res.status(201).send(posts[id])
})

app.post('/events',(req,res)=>{
    console.log('received event @posts/index.js',req.body.type)
    res.send({})
})

app.listen(4000,()=>{
    console.log(`listening posts on  port 4000`)
})