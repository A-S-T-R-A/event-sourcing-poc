const express = require("express")
const cors = require("cors")
const events = require("events")
const PORT = 5000

const emitter = new events.EventEmitter()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/connect", (req, res) => {
    res.writeHead(200, {
        Connection: "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
    })
    const onMessage = message => {
        res.write(`data: ${JSON.stringify(message)} \n\n`)
    }
    emitter.on("newMessage", onMessage)

    res.on("close", () => {
        emitter.removeListener("newMessage", onMessage)
    })
})

app.post("/new-messages", (req, res) => {
    const message = { ...req.body, id: Date.now() }
    emitter.emit("newMessage", message)
    res.status(204).end()
})

app.post("/trigger-notification", (req, res) => {
    const { type } = req.body
    const text = type.slice(0, 1).toUpperCase() + type.slice(1)
    const message = { type, message: `${text} message from admin panel.`, id: Date.now() }
    emitter.emit("newMessage", message)
    res.status(204).end()
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
