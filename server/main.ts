enum PacketType {
    ImageData = 1,
}

Deno.serve({ port: 9023 }, (req) => {
    if (req.headers.get("upgrade") != "websocket") {
        return new Response(null, { status: 501 })
    }

    const { socket, response } = Deno.upgradeWebSocket(req)

    let width = 0
    let height = 0
    let active = false

    let startTime: number = 0

    socket.addEventListener("open", () => {
        console.log("Client connected")
    })

    const interval = setInterval(() => {
        if (!active) return
        const nextFrameTime = Date.now() - startTime + 5000
        socket.send(new Uint8Array([PacketType.ImageData, nextFrameTime & 0x000000ff, (nextFrameTime & 0x0000ff00) >> 8, (nextFrameTime & 0x00ff0000) >> 16, (nextFrameTime & 0xff000000) >> 24, ...new Array(width * height).fill([255, Math.floor(Math.random() * 255), 255, 255]).flat()]).buffer)
    }, 1000 / 20)

    socket.addEventListener("message", (event) => {
        if (event.data.startsWith("size=")) {
            width = parseInt(event.data.split("size=")[1].split("x")[0])
            height = parseInt(event.data.split("size=")[1].split("x")[1])
            console.log("Size:", width, "x", height)
        }
        if (event.data == "go") {
            console.log("Client active")
            startTime = Date.now()
            active = true
        }
    })

    socket.addEventListener("close", () => clearInterval(interval))
    socket.addEventListener("error", () => clearInterval(interval))

    return response
})
