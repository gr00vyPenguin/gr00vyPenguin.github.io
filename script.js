const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')

const img1 = new Image()
img1.src = 'bbwbb.jpg'

const inputSlider = document.getElementById('resolution')
const inputLabel = document.getElementById('resolutionLabel')

inputSlider.addEventListener('change', handleSlider)


class Cell {
    constructor(x, y, symbol, color){
        this.x = x
        this.y = y
        this.symbol = symbol
        this.color = color
    }

    draw(ctx){
        ctx.fillStyle = 'white'
        ctx.fillText(this.symbol, this.x + 0.5, this.y + 0.5)
        ctx.fillStyle = this.color
        ctx.fillText(this.symbol, this.x, this.y)
    }
}

class AsciiEffect{
    #imageCellArray = []
    #symbols = []
    #pixels = []
    #ctx
    #width
    #height

    constructor(ctx, width, height){
        this.#ctx = ctx
        this.#width = width
        this.#height = height
        this.#ctx.drawImage(img1, 0, 0, this.#width, this.#height)
        this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height)
    }

    #convertToSymbol(g){
        if (g > 250) return '@'
        else if (g > 240) return '*'
        else if (g > 220) return '+'
        else if (g > 200) return '#'
        else if (g > 180) return '&'
        else if (g > 160) return '%'
        else if (g > 140) return '_'
        else if (g > 120) return ':'
        else if (g > 100) return '$'
        else if (g > 80) return '/'
        else if (g > 60) return '-'
        else if (g > 40) return 'X'
        else if (g > 20) return 'W'
        else return ''
    }

    #scanImage(cellSize){
        this.#imageCellArray = []
        for(let y = 0; y < this.#pixels.height; y += cellSize){
            for(let x = 0; x < this.#pixels.width; x += cellSize){
                const posX = x * 4
                const posY = y * 4
                const pos = (posY * this.#pixels.width) + posX

                if(this.#pixels.data[pos + 3] > 128){
                    const r = this.#pixels.data[pos]
                    const g = this.#pixels.data[pos + 1]
                    const b = this.#pixels.data[pos + 2]
                    const totalColVal = r + g + b
                    const avgColVal = totalColVal/3
                    const color = 'rgb(' + r + ',' + g + ',' + b + ')' 
                    const symbol = this.#convertToSymbol(avgColVal)
                    if (totalColVal > 200) this.#imageCellArray.push(new Cell(x,y,symbol,color))
                }
            }
        }
    }

    #drawAscii(){
        this.#ctx.clearRect(0, 0, this.#width, this.#height)
        for(let i = 0; i < this.#imageCellArray.length; i++){
            this.#imageCellArray[i].draw(this.#ctx)
        }
    }


    draw(cellSize){
        this.#scanImage(cellSize)
        this.#drawAscii()
    }
}

let effect

function handleSlider(){
    if(inputSlider.value == 1){
        inputLabel.innerHTML = 'Original'
        ctx.drawImage(img1, 0, 0, canvas.width, canvas.height)
    } else{
        inputLabel.innerHTML = 'Resolution: ' + inputSlider.value + ' px'
        ctx.font = parseInt(inputSlider.value) * 1.2 + 'px Roboto'
        effect.draw(parseInt(inputSlider.value))
        
    }
}
img1.onload = function initialize(){
    canvas.width = img1.width
    canvas.height = img1.height
    console.log(canvas.width)
    console.log(canvas.height)

    effect = new AsciiEffect(ctx, img1.width, img1.height)
    handleSlider()
}