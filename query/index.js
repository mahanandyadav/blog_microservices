const express=require('express')
const cors=require('cors')
const bodyParser=require('body-parser')

const app=express()
app.use(bodyParser.json())
app.use(cors())

const posts={}
app.get('/posts',(req,res)=>{
    
    res.send(posts);
})
app.post('/query',(req,res)=>{
    const {type,data}=req.body;
    console.log(req.body)
    if(type==='PostCreated'){
        const {id,title}=data
        posts[id]={id,title,comments:[]}
      
    }
    if(type==='CommentCreated'){
        const {id,content,postId,status}=data 
        const post=posts[postId]
        post.comments.push({id,content,status})
    }    
    if(type==='CommentUpdated'){
        const {id,content,postId,status}=data
        const post=posts[postId]
        const comment=post.comments.find(comment=>{
            return comment.id===id
        })
        comment.status=status
        comment.content=content
    }
    // console.log(posts)
    res.send({})
})

app.listen(4002,(err)=>{
    console.log(`listening on port 4002 for query ${err}`)
})