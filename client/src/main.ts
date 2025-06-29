const ip = "127.0.0.1:9023"
enum PacketType {
    ImageData = 1,
}

const mainCanvas = document.getElementById("main") as HTMLCanvasElement
const ctx = mainCanvas.getContext("2d")!

mainCanvas.width = innerWidth
mainCanvas.height = innerHeight

function uInt32ToInt(w: number, x: number, y: number, z: number) {
    return (z << 24) + (y << 16) + (x << 8) + w
}

function start() {
    const ws = new WebSocket("ws://" + ip)
    let startTime: number
    ws.onopen = () => {
        ws.send("size=" + innerWidth + "x" + innerHeight)
        ws.send("go")
        startTime = Date.now()
    }
    ws.onmessage = async (ev) => {
        const data = new Uint8Array(await (ev.data as Blob).arrayBuffer())
        if (0 in data) {
            if (data[0] == PacketType.ImageData) {
                // @ts-expect-error because I don't feel like fixing this thing
                const delayTime = uInt32ToInt(...Array.from(data.slice(1, 5)))
                const imageData = new ImageData(new Uint8ClampedArray(data.slice(5)), mainCanvas.width, mainCanvas.height)
                setTimeout(() => {
                    ctx.putImageData(imageData, 0, 0)
                }, delayTime - (Date.now() - startTime))
            }
        }
    }
}
start()
