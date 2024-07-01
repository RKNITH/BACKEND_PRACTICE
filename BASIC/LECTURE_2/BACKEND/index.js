import express from "express"
import dotenv from 'dotenv'

dotenv.config();

const port = process.env.PORT || 4000;
const app = express()

app.get("/", (req, res) => {
    res.send('hello raviranjann kumar')
})

app.get('/api/jokes', (req, res) => {
    const jokes = [
        {
            id: 1,
            title: 'A joke',
            content: 'This is a joke'
        },
        {
            id: 1,
            title: 'A joke',
            content: 'This is a joke'
        },
        {
            id: 2,
            title: 'A joke',
            content: 'This is another joke'
        },
        {
            id: 3,
            title: 'A joke',
            content: 'This is smart joke'
        },
        {
            id: 4,
            title: 'A joke',
            content: 'This is beautiful joke'
        },
    ];
    res.send(jokes)
})

app.listen(port, () => {
    console.log(`server is running at ${port}`)
})
