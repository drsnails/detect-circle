'use strict'
let gElCanvas
/**
 * The 2D rendering context of the canvas element.
 * @type {CanvasRenderingContext2D}
 */
let gCtx
let gLastPos = null
let gIsMouseDown = false
let gBrush = {
    color: 'black',
    size: 2,
    shape: 'pencil',
}
let gSocket

let gLastPositions = []


const gDrawFns = {
    pencil: drawPencil
}



function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()

    document.addEventListener('keydown', ev => {
        if (ev.key === 'Escape' || ev.key.toLowerCase() === 'c') {
            gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
            renderScore()
        }
    })
}



function onDown(ev) {
    const pos = getEvPos(ev)
    gIsMouseDown = true
    gLastPos = pos
    gLastPositions = []
}

function onMove(ev) {
    if (!gIsMouseDown) return
    let pos = getEvPos(ev)
    const draw = gDrawFns[gBrush.shape]
    draw({ pos })
    gLastPos = pos
    gLastPositions.push(pos)

}


function onUp() {
    gIsMouseDown = false
    calculateCircleAccuracy()
}

function calculateCircleAccuracy() {
    const avgPos = gLastPositions.reduce((vecSum, pos) => {
        vecSum.x += pos.x
        vecSum.y += pos.y
        return vecSum
    }, { x: 0, y: 0 })
    avgPos.x /= gLastPositions.length
    avgPos.y /= gLastPositions.length

    const avgDistance = calcAvgDistanceFromCenter(avgPos)
    let variance = gLastPositions.reduce((sum, pos) => {
        let individualDist = distance(avgPos, pos);
        let diff = Math.abs(individualDist - avgDistance) / avgDistance;
        return sum + diff ** 2;
    }, 0) / gLastPositions.length;

    let sensitivity = 0.6
    console.log('variance:', variance)
    let finalScore = Math.exp(-Math.sqrt(variance) / (sensitivity));

    // drawCircle(avgPos, 5, 'black')
    drawText(avgPos, finalScore.toFixed(2), 12)
    renderScore(finalScore)
}

function renderScore(score) {
    const elPercentDisplay = document.querySelector('.percent-display h1')
    elPercentDisplay.innerText = score ? Math.round(score * 100) + '%' : ''
}

function calcAvgDistanceFromCenter(avgPos) {
    const avgDistance = gLastPositions.reduce((distSum, pos) => {
        return distSum + distance(avgPos, pos)
    }, 0) / gLastPositions.length

    return avgDistance
}


function distance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)

}

function getPosPercent(pos) {
    return {
        x: pos.x / gElCanvas.width,
        y: pos.y / gElCanvas.height,
    }
}

function getPosPixels(pos) {
    return {
        x: pos.x * gElCanvas.width,
        y: pos.y * gElCanvas.height,
    }
}


function drawCircle(pos, r, fillColor) {
    gCtx.beginPath()
    gCtx.arc(pos.x, pos.y, r, 0, Math.PI * 2)
    gCtx.fillStyle = fillColor
    gCtx.fill()
}



function drawText(pos, text, fontSize = 16) {
    gCtx.font = `${fontSize}px Arial`
    gCtx.fillStyle = gBrush.color
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'
    gCtx.fillText(text, pos.x, pos.y)
}


function drawPencil({ pos, brush = gBrush, lastPos = gLastPos }) {
    gCtx.beginPath()
    gCtx.moveTo(lastPos.x, lastPos.y)
    gCtx.lineTo(pos.x, pos.y)
    gCtx.lineCap = 'round'
    gCtx.strokeStyle = brush.color
    gCtx.lineWidth = brush.size
    gCtx.stroke()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    let width = elContainer.offsetWidth
    let height = elContainer.offsetHeight
    const minSize = Math.min(window.innerWidth, window.innerHeight) * 0.9
    if (width > minSize || height > minSize) {
        width = minSize
        height = minSize
    }
    gElCanvas.width = width
    gElCanvas.height = height
}
