import { useEffect, useRef, useState } from "react"

export function useWebSocket(url: string, onMessage: (message: { action: string, data: any }) => void, onConnection?: () => void) {
    const ws = useRef<WebSocket | null>(null)
    const [_, forceUpdate] = useState({})

    useEffect(() => {
        const socket = connect()
        return () => socket.close()
    }, [])

    function connect() {
        console.log("Connecting...")

        ws.current = new WebSocket(url)
        const socket = ws.current

        socket.addEventListener("open", () => {
            onConnection?.()
            console.log("CONNECTED")
            forceUpdate({})
        });

        socket.addEventListener("message", (event: MessageEvent) => {
            if (typeof event.data === "string") {
                onMessage(JSON.parse(event.data))
                return
            }
            event.data.text()
                .then((message: string) => {
                    onMessage(JSON.parse(message))
                })
        });
        socket.addEventListener("close", () => {
            forceUpdate({})
        })

        socket.addEventListener("error", (event: Event) => {
            console.log("Error", event)
        })

        return socket
    }

    const State_Map = {
        [0]: 'Connecting',
        [1]: 'Open',
        [2]: 'Closing',
        [3]: 'Closed',
        [4]: 'Uninstantiated',
        [5]: 'Unknown'
    } as const
    const state = ws.current?.readyState as (keyof typeof State_Map)
    const connectionStatus = State_Map[state ?? 5];

    function sendMessage(message: { action: string, data?: any }) {
        console.log("STATE:", state)
        if (ws.current?.OPEN) {
            ws.current?.send(JSON.stringify(message))
        } else {
            console.log("Socket not open... didn't send")
        }
    }

    const WebsockApi: WebsocketApi = {
        Messaages: new Messages(sendMessage),
        Channels: new Channels(sendMessage)
    }

    return { sendMessage, status: connectionStatus, close: () => ws.current?.close(), WebsockApi }
}

export type WebsocketApi = {
    Messaages: Messages
    Channels: Channels
}
type TSendMessage = (message: { action: string, data?: any }) => void

abstract class SockAPI {
    protected sendMessage: TSendMessage
    abstract actionPrefix: string
    constructor(sendMessage: TSendMessage) {
        this.sendMessage = sendMessage
    }
}

class Messages extends SockAPI {
    actionPrefix = "messages"
    send(text: string) {
        this.sendMessage({ action: `${this.actionPrefix}.new`, data: text })
    }
}

class Channels extends SockAPI {
    actionPrefix = "channels"
    connect(channelId: string) {
        this.sendMessage({
            action: `${this.actionPrefix}.connect`, data: {
                channelId
            }
        })
    }
    leave() {
        this.sendMessage({ action: `${this.actionPrefix}.leave` })
    }
}