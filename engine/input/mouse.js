export var mX = 0;
export var mY = 0;
export var down = false;

var canvas;

var coordOffsetX = 0;
var coordOffsetY = 0;

/**
 * Sets the canvas so that the mouse listener can get accurate mouse locations relative to the canvas
 *
 * @param boundingCanvas {object} The canvas to bind the mouselistener to 
 */
export function init(boundingCanvas) {
    canvas = boundingCanvas;
    
    coordOffsetX = canvas.getBoundingClientRect().x;
    coordOffsetY = canvas.getBoundingClientRect().y;
}

/**
 * Get x position of mouse
 *
 * @return {number} X position
 */
export function getX() {
    return mX;
}

/**
 * Get y position of mouse
 *
 * @return {number} Y position
 */
export function getY() {
    return mY;
}

/**
 * Get whether or not the mouse is down
 *
 * @return {boolean} Whether or not the mouse is down
 */
export function isDown() {
    return down;
}


document.onmousedown = () => {
    down = true;
}

document.onmouseup = () => {
    down = false;
}

document.onmousemove = (e) => {
    coordOffsetX = canvas.getBoundingClientRect().x;
    coordOffsetY = canvas.getBoundingClientRect().y;

    mX = e.clientX - coordOffsetX;
    mY = e.clientY - coordOffsetY;
}