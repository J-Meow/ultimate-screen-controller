const ip = "127.0.0.1:9023"

function start() {
    const ws = new WebSocket("ws://" + ip)
    ws.onopen = () => {
        ws.send("size=" + innerWidth + "x" + innerHeight)
        ws.send("go")
    }
}
start()
