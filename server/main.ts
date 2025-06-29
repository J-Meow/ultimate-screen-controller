Deno.serve({ port: 9023 }, (req) => {
    if (req.headers.get("upgrade") != "websocket") {
        return new Response(null, { status: 501 })
    }

    const { socket, response } = Deno.upgradeWebSocket(req)

    socket.addEventListener("open", () => {
        console.log("Client connected")
    })

    socket.addEventListener("message", (event) => {
        if (event.data === "ping") {
            socket.send("pong")
        }
    })

    return response
})
