const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let paths = [];
let redoStack = []; // stack to keep track of undone paths
let drawing = false; // bollean flag indicating wheather the user is currently drawing
let currentTool = 'pencil'; //track the active tool
let currentColor = '#000000'; // track the active color
let brushSize = 5;//

//Adjest the canvas resolution based on device pixel ratio for better rendering quality
function canvasSetup(){
    //retrive physical dimension of the canvas element as it appears on the browser
    const rect = canvas.getBoundingClientRect();
    //get the device pixel ratio which is bassically the number of physical screen pixels per CSS pixel
    const dpi = window.devicePixelRatio ;

    canvas.width = rect.width * dpi; // set the canvas width to the device pixel ratio
    canvas.height = rect.height * dpi; // set the canvas height to the device pixel ratio
}
canvasSetup(); // call the function to set up the canvas

function setActiveTool(tool) {
    currentTool = tool; // set the current tool to the selected one
    document.querySelectorAll('.toolItem').forEach(btn => btn.classList.remove('active')); // remove the active class from all buttons

    document.getElementById(`${tool}Button`).classList.add('active'); // add the active class to the selected button
}

document.addEventListener('DOMContentLoaded',(event)=>{
    document.getElementById('pencilButton').addEventListener('click', () => setActiveTool('pencil'));
    document.getElementById('erasorButton').addEventListener('click', () => setActiveTool('eraser'));
    document.getElementById('undoButton').addEventListener('click', () => undoLastAction());
    document.getElementById('redoButton').addEventListener('click', () => redoLastAction());
    document.getElementById('clearButton').addEventListener('click', () => clearCanvas());
    //document.getElementById('clearButton').addEventListener('click', () => clearCanvas());
    document.getElementById('colorPicker').addEventListener('change', (event) => {
        currentColor = event.target.value; // update the current color based on the color picker input
        setActiveTool('pencil'); // set the active tool to pencil when color is changed
    });
    document.getElementById('brushSize').addEventListener('input', (event) => {
        brushSize = event.target.value; // update the brush size based on the input value
    });

    canvas.addEventListener('mousedown', startDrawing); // add event listener for mousedown event
    canvas.addEventListener('mousemove', draw); 
    canvas.addEventListener('mouseup', stopDrawing); // add event listener for mousemove event
    canvas.addEventListener('mouseleave', stopDrawing); 
    setActiveTool('pencil'); // set the default active tool to pencil
})

function draw(e){
    if(!drawing) return; // if not drawing, exit the function
    const mousePos = getMousePos( e); 
    if(paths.length > 0){
    paths[paths.length-1].points.push(mousePos)// get the mouse position on the canvas
    redrawCanvas(); // redraw the canvas with the updated paths
}
}


function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio , canvas.height / window.devicePixelRatio); // clear the entire canvas
   paths.forEach(drawPath); // iterate over each path and draw it on the canvas
      
}
function drawPath(path) {
    ctx.beginPath(); // begin a new path
    ctx.moveTo(path.points[0].x, path.points[0].y); // move to the first point of the path

    for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y); // draw a line to each subsequent point
    }
    ctx.strokeStyle = path.color; // set the stroke color to the path color
    ctx.lineWidth = path.width; // set the line width to the path width
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke(); // draw the path on the canvas
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect(); // get the bounding rectangle of the canvas
    //const dpi = window.devicePixelRatio; // get the device pixel ratio
    // return {
    //     x: (e.clientX - rect.left) * dpi, // calculate the x position relative to the canvas
    //     y: (e.clientY - rect.top) * dpi // calculate the y position relative to the canvas
    // };

    const x = (e.clientX - rect.left) * (canvas.width / rect.width); // calculate the x position relative to the canvas
    const y = (e.clientY - rect.top) * (canvas.height / rect.height); // calculate the y position relative to the canvas
    return { x, y }; // return the mouse position as an object
}



function undoLastAction() {
    if (paths.length > 0) {
        redoStack.push(paths.pop()); // remove the last path from the array
        redrawCanvas(); // redraw the canvas with the updated paths
    }
}

function startDrawing(e){
    drawing = true; // set the drawing flag to true
    const mousePos = getMousePos(e); // get the mouse position on the canvas
    paths.push({
        color: currentTool === 'eraser' ? 'white':currentColor, // set the color of the path to the current color
        width: brushSize, // set the size of the path to the current brush size
        points: [mousePos] // initialize the points array with the current mouse position
        
    });

    redrawCanvas(); // redraw the canvas with the updated paths

   // redoStack= [] // initialize the redo stack as an empty array

}


function stopDrawing(){
    drawing = false; // set the drawing flag to false
   
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the entire canvas
    paths = []; // reset the paths array to an empty array
    redoStack = []; // reset the redo stack to an empty array
    // ctx.fillStyle = 'white'; // set the fill color to white
    // ctx.fillRect(0, 0, canvas.width, canvas.height); // fill the canvas with white color
}

function redoLastAction() {
    if (redoStack.length > 0) {
        paths.push(redoStack.pop()); // remove the last path from the redo stack and add it to the paths array
        redrawCanvas(); // redraw the canvas with the updated paths
    }
}
