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
    if (ev.shiftKey) {
        gLastPositions = drawCircle(pos, 100, 0.1)
    }

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
    const { avgPos, radialScore, avgDistance } = getRadialScore()
    const sharpnessScore = getSharpnessScore()
    console.log('avgDistance:', avgDistance)
    // const radialPercent = avgDistance < 35 ? (avgDistance / 35) : 0.6
    // const radialPercent = avgDistance < 40 ? (1-avgDistance / 40) : 0.6
    const radialPercent = 0.6
    const finalScore = (sharpnessScore * (1 - radialPercent) + radialScore * radialPercent)
    drawText(avgPos, finalScore.toFixed(2), 12)
    renderScore(finalScore)
}

function getRadialScore() {
    const avgPos = gLastPositions.reduce((vecSum, pos) => {
        vecSum.x += pos.x
        vecSum.y += pos.y
        return vecSum
    }, { x: 0, y: 0 })
    avgPos.x /= gLastPositions.length
    avgPos.y /= gLastPositions.length

    const avgDistance = calcAvgDistanceFromCenter(avgPos)
    let variance = gLastPositions.reduce((sum, pos) => {
        const individualDist = distance(avgPos, pos)
        const diff = Math.abs(individualDist - avgDistance) / avgDistance
        return sum + diff
    }, 0) / gLastPositions.length

    let sensitivity = 0.3
    let radialScore = Math.exp(-variance / (sensitivity))
    return { avgPos, radialScore, avgDistance }
}

function getSharpnessScore() {
    const circleVectors = gLastPositions.map((point, idx) => {
        const nextPoint = gLastPositions[idx + 1] || {}
        return { x: nextPoint.x - point.x, y: nextPoint.y - point.y }
    })
    let minDotProduct
    let cornerCount = 0
    circleVectors.forEach((vector, idx) => {
        if (idx >= circleVectors.length - 5) return
        const nextVector = circleVectors[idx + 1] || vector
        const dotProduct = getDotProduct(vector, nextVector)
        if (dotProduct < 0.1) cornerCount++
        if (minDotProduct === undefined || dotProduct < minDotProduct) {
            minDotProduct = dotProduct
        }
    })
    const cornerPercent = cornerCount / circleVectors.length
    return cornerPercent >= 0.1 ? 0.5 : 1

}

function renderScore(score) {
    const elPercentDisplay = document.querySelector('.percent-display h1')
    elPercentDisplay.innerText = score ? Math.round(score * 100) + '%' : ''
}

function getDotProduct(v1, v2) {
    return (v1.x * v2.x + v1.y * v2.y) / (vectorSize(v1) * vectorSize(v2))
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


function drawCircle(pos, r, ...rest) {
    const points = arcPoints(pos, r, ...rest)
    points.forEach((p, idx) => {
        gCtx.beginPath()
        const nextPoint = points[idx + 1] || {}
        gCtx.moveTo(nextPoint.x, nextPoint.y)
        gCtx.lineTo(p.x, p.y)
        gCtx.lineCap = 'round'
        // gCtx.strokeStyle = brush.color
        gCtx.lineWidth = 2
        gCtx.stroke()

    })
    return points
    // gCtx.fillStyle = fillColor
    // gCtx.fill()
}


function arcPoints(pos, r, diff = 0.2, start = 0, end = 2 * Math.PI + diff) {
    const pts = []

    for (let t = start; t <= end; t += diff) {

        pts.push({
            x: pos.x + r * Math.cos(t),
            y: pos.y + r * Math.sin(t)
        })
    }

    return pts
}


function drawText(pos, text, fontSize = 16) {
    gCtx.font = `${fontSize}px Arial`
    gCtx.fillStyle = gBrush.color
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'
    gCtx.fillText(text, pos.x, pos.y)
}


function vectorSize(v) {
    return Math.sqrt(v.x ** 2 + v.y ** 2) || 0.1
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
