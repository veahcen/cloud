const express = require("express")
const mongoose = require("mongoose")
const router = require('./routes/index')
const config = require("config")

const app = express()
const PORT = config.get('serverPort') // получаем порт

app.use(express.json())
app.use('/api', router)

const start = async () => {
    try {
        await mongoose.connect(config.get("dbUrl"))

        app.listen(PORT, () => {
            console.log('Server started on port', PORT)
        })
    } catch (e) {

    }
}

start()