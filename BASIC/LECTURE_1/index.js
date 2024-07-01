import express from "express"
import dotenv from 'dotenv'

dotenv.config();

const port = process.env.PORT || 4000;
const app = express()

app.get("/", (req, res) => {
    res.send('hello raviranjan')
})

app.listen(port, () => {
    console.log(`server is running at ${port}`)
})
