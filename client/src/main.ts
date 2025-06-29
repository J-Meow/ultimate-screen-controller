const ip = "127.0.0.1:9023"
enum PacketType {
    Pixel = 1,
}

function uInt16ToInt(x: number, y: number) {
    return (y << 8) + x
}

function start() {
    const ws = new WebSocket("ws://" + ip)
    ws.onopen = () => {
        ws.send("size=" + innerWidth + "x" + innerHeight)
        ws.send("go")
    }
    ws.onmessage = async (ev) => {
        const data = await (ev.data as Blob).bytes()
        if (0 in data) {
            if (data[0] == PacketType.Pixel) {
                console.log(uInt16ToInt(data[1], data[2]), uInt16ToInt(data[3], data[4]))
                console.log(data[5], data[6], data[7])
            }
        }
    }
}
start()
