'use strict'



function getEvPos(ev) {
    const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

    let clientX = ev.clientX
    let clientY = ev.clientY

    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()
        const touch = ev.changedTouches[0]
        clientX = touch.clientX
        clientY = touch.clientY
    }

    const rect = gElCanvas.getBoundingClientRect()
    const scaleX = gElCanvas.width / rect.width
    const scaleY = gElCanvas.height / rect.height

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
    }
}
