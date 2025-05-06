const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let paths = [];
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