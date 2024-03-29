const express = require("express")
const mongoose = require("mongoose")
const router = require("./routes/index")
const config = require("config")
const errorHandler = require("./middleware/ErrorHendMiddleware")
const corsMiddleware = require("./middleware/corsMiddleware")

const app = express()
const PORT = config.get('serverPort') // получаем порт

app.use(corsMiddleware)
app.use(express.json())
app.use('/api', router)

// Обработка ошибок в конце, последний мидлвеир, next не нужет
app.use(errorHandler)

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