const express =require('express')
const {randomBytes}=require('crypto')
const axios=require('axios')
const bodyParser=require('body-parser')
const app =express()
app.use(express.json())
app.use(bodyParser.json())
const commentsByPostId={}

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
app.get('/posts/:id/comments',(req,res)=>{
    res.send(commentsByPostId[req.params.id]||[])
})
app.post('/posts/:id/comments',async(req,res)=>{
    const commentId=randomBytes(4).toString('hex')
    const {content}=req.body;

    const comments=commentsByPostId[req.params.id]|| [];

    comments.push({id:commentId,content,status:'pending'})
    commentsByPostId[req.params.id]=comments;
   await axios.post('http://localhost:4005/events',{
        type:'CommentCreated',
        data:{
            id:commentId,
            content,
            postId:req.params.id,
            status:'pending'
        }
    }).catch((err) => {
        console.log(`==================in comments==================`);
        console.log(err.message);
        console.log(`====================================`);
    })
        res.status(201).send(comments);
})


// app.post('/events',async(req,res)=>{
    app.post('/comment',async(req,res)=>{
    const {type,data}=req.body
    if(type==='CommentModerated'){
        const { postId,id,status,content}=data
        const comments=commentsByPostId[postId]
        const comment=comments.find(comment=>{
            return comment.id=id
        })
        comment.status=status;
        // console.log(req.body)
        await axios.post('http://localhost:4005/events',{
            type:'CommentUpdated',
            data:{
                id,status,postId,content

            }
        }).catch((err) => {
            console.log(`==============in comments/commentupdated======================`);
            console.log(err.message);
            console.log(`====================================`);
        })
    }
        console.log('received event @comments/index.js',req.body.type)

    res.send({})
})

app.listen(4001,()=>{
    console.log(`listening comments on  port 4001 comments`)
})