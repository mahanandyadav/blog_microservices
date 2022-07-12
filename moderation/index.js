const express = require('express')
const axios = require('axios')
// const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
// app.use(express.json())
app.use(bodyParser.json())
// app.use(cors())

/*
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
*/
app.get('/events', (req, res) => {
    res.send({})
})
app.post('/moderation', async (req, res) => {
    const { type, data } = req.body;
    if (type === 'CommentCreated') {
        const status = data.content.includes('orange') ? "rejected" : "approved";

        await axios.post("http://localhost:4005/events", {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }
    res.send({})
})

app.listen(4003, (err) => {
console.log(`listening on 4003 moderation error:${err}`)
})

