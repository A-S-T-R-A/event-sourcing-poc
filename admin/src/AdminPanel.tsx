import axios from "axios"
import "notyf/notyf.min.css"

export function AdminPanel() {
    const sendNotification = async (type: string) => {
        try {
            await axios.post("http://localhost:5000/trigger-notification", {
                type,
            })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <h2>Административная панель</h2>
            <div>
                <button onClick={() => sendNotification("info")}>
                    Отправить информационное уведомление
                </button>
                <button onClick={() => sendNotification("warning")}>
                    Отправить предупреждение
                </button>
                <button onClick={() => sendNotification("error")}>Отправить ошибку</button>
            </div>
        </div>
    )
}
