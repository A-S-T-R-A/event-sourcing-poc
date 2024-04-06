import React, { useEffect, useState } from "react"
import axios from "axios"
import { Notyf } from "notyf"
import "notyf/notyf.min.css"
import { Box, Typography, IconButton, Popover, Badge } from "@mui/material"
import NotificationsIcon from "@mui/icons-material/Notifications"

const EventSourcing = () => {
    const [messages, setMessages] = useState([])
    const [anchorEl, setAnchorEl] = useState(null)
    const notyf = new Notyf({ duration: 2000, position: { x: "right", y: "top" } })

    useEffect(() => {
        subscribe()
    }, [])

    const subscribe = async () => {
        const eventSource = new EventSource(`http://localhost:5000/connect`)
        eventSource.onmessage = function (event) {
            const message = JSON.parse(event.data)
            notyf.success("New notification received")
            setMessages(prev => [message, ...prev])
        }
    }

    const sendNotification = async type => {
        let message
        switch (type) {
            case "info":
                message = "This is an info message."
                break
            case "warning":
                message = "This is a warning message."
                break
            case "error":
                message = "This is an error message."
                break
            default:
                notyf.error("Unknown notification type")
                return
        }

        await axios.post("http://localhost:5000/new-messages", {
            message,
            id: Date.now(),
        })

        notyf.success("Notification sent")
    }

    const handleClick = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)
    const id = open ? "simple-popover" : undefined

    return (
        <Box
            sx={{
                position: "fixed",
                top: 16,
                right: 16,
                display: "flex",
                flexDirection: "row-reverse",
            }}
        >
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={messages.length} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography sx={{ mb: 2, fontSize: "20px", letterSpacing: "0.6px" }}>
                        Notifications
                    </Typography>
                    {messages.map((item, index) => (
                        <Typography
                            key={item.id}
                            sx={{
                                mb: 1,
                                color: "info.main",
                                borderBottom: "1px solid #ccc",
                            }}
                        >
                            {new Date(item.id).toLocaleTimeString()}: {item.message}
                        </Typography>
                    ))}
                </Box>
            </Popover>
        </Box>
    )
}

export default EventSourcing
