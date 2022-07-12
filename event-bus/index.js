const express = require('express')
const  axios= require('axios')
const bodyParser = require('body-parser')
const app = express()
// app.use(express.json())
app.use(bodyParser.json())

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

app.post('/events',async (req, res) => {
    const event = req.body
    console.log(event)
    axios.post('http://localhost:4000/events', event).catch((err) => {
        console.log(`================4000/post====================`);
        console.log(err.message);
        console.log(`====================================`);
    });
    axios.post('http://localhost:4001/comment', event).catch((err) => {
        console.log(`===============4001/events=====================`);
        console.log(err.message);
        console.log(`====================================`);
    });
    axios.post('http://localhost:4002/query', event).catch((err) => {
        console.log(`==================4002/events==================`);
        console.log(err.message);
        console.log(`====================================`);
    });
    axios.post('http://localhost:4003/moderation', event).catch((err) => {
        console.log(`==================from moderation 4003/events==================`);
        console.log(err.message);
        console.log(`====================================`);
    });
    res.send({ status: 'OK' })
})

app.listen(4005, (err) => {
    console.log('listening event-bus on 4005, error-> ' + err)
})