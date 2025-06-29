const ip = "127.0.0.1:9023"
enum PacketType {
    ImageData = 1,
}

const mainCanvas = document.getElementById("main") as HTMLCanvasElement
const ctx = mainCanvas.getContext("2d")!

mainCanvas.width = innerWidth
mainCanvas.height = innerHeight

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
            if (data[0] == PacketType.ImageData) {
                const imageData = new ImageData(new Uint8ClampedArray(data.slice(1)), mainCanvas.width, mainCanvas.height)
                ctx.putImageData(imageData, 0, 0)
            }
        }
    }
}
start()
