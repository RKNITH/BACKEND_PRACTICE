import express from "express"

const PORT = 3000
const app = express()

app.get("/", (req, res) => {
    res.send('helo')
})

app.listen(PORT, () => {
    console.log(`server is runnig at port ${PORT}`);
})