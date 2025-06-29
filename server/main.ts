Deno.serve({ port: 9023 }, (req) => {
    if (req.headers.get("upgrade") != "websocket") {
        return new Response(null, { status: 501 })
    }

    const { socket, response } = Deno.upgradeWebSocket(req)

    let width = 0
    let height = 0

    socket.addEventListener("open", () => {
        console.log("Client connected")
    })

    socket.addEventListener("message", (event) => {
        if (event.data.startsWith("size=")) {
            width = parseInt(event.data.split("size=")[1].split("x")[0])
            height = parseInt(event.data.split("size=")[1].split("x")[1])
            console.log("Size:", width, "x", height)
        }
    })

    return response
})
