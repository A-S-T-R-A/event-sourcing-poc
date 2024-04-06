import React, { useEffect, useState } from "react"
import axios from "axios"
import { Notyf } from "notyf"
import "notyf/notyf.min.css"

const EventSourcing = () => {
    const [messages, setMessages] = useState([])
    const [value, setValue] = useState("")
    const [isShown, setIsShown] = useState(false)
    const notyf = new Notyf({ duration: 2000, position: { x: "right", y: "top" } })

    useEffect(() => {
        subscribe()
    }, [])

    const subscribe = async () => {
        const eventSource = new EventSource(`http://localhost:5000/connect`)
        eventSource.onmessage = function (event) {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
    }

    const sendMessage = async () => {
        if (value.trim() === "") {
            notyf.error("Сообщение не может быть пустым")
            return
        }

        await axios.post("http://localhost:5000/new-messages", {
            message: value,
            id: Date.now(),
        })

        setValue("")
        notyf.success("Сообщение отправлено")
    }

    return (
        <div className="center">
            <div>
                <h1>All notifications</h1>
                <div className="form">
                    <input value={value} onChange={e => setValue(e.target.value)} type="text" />
                    <button onClick={sendMessage}>Отправить</button>
                    <div className="messages">
                        {messages.map(mess => (
                            <div className="message" key={mess.id}>
                                {mess.message}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventSourcing
