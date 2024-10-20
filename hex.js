var cvs;
var ctx;
var gridCartesian = []; //Store grid coordinates in cartesian coordinate system
var gridAxial = []; //Store grid coordinates in axial coordinate system
var d = 25; // Default hexagon radius
var n = 3;  // Default number of hexagons
var cWidth; // Canvas width
var cHeight; // Canvas height

// Flags
var oritentate = 0; // 0 for flat side, 1 for pointy side
var currentRotation = 0; // Current rotation angle
var showGrid = 0; // Flag to show or hide grid. 0 = Off, 1 = Cartesian, 2 = Axial

document.addEventListener('DOMContentLoaded', function() {
    cvs = document.getElementById('hexbreakout');
    ctx = cvs.getContext('2d');

    // Call the function initially and whenever the window is resized
    resizeCanvas();

    // Add event listeners for controls and window resizing
    addEventListeners();

    updateCanvas();
});



function updateCanvas() {
    // Clear the canvas
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    // Translate to the center of the canvas and apply the current rotation
    ctx.save();  // Save the current context state
    ctx.translate(cvs.width / 2, cvs.height / 2);
    ctx.rotate(currentRotation);

    // Redraw the hexagonal grid
    fillHexPattern(d, 0, 0);
    // Show or hide grid
    if(showGrid) drawGrid(d);

    // Restore the context to remove the translation and rotation for future drawings
    ctx.restore();

}

// Function to tile the entire canvas using 
function fillHexPattern(d, xoffset, yoffset) {
    let q, r, x, y;
    for (q = -n; q <= n; q++) {
        for (r = -n; r <= n; r++) {
            if (Math.max(Math.abs(q), Math.abs(r), Math.abs(-q - r)) < n) {
                [x, y] = hexToCart([q, r], d);
                drawHex(x + xoffset, y + yoffset, d);
                if(showGrid){
                    ctx.textAlign = "center";
                    ctx.fillText("(" + q + "," + r + ")", x, y);
                }
            }
        }
    }
}

// Transform Axial coordinates into cartesian coordinates of unit size d (1 unit is a hexagon of radius d)
function hexToCart(h, d) {
    let x = (3 / 2) * h[0] * d;
    let y = Math.sqrt(3) * d * (h[1] + (h[0] / 2));
    return [x, y];
}

// Draw a single hexagon at the coordinates (x,y) and of size r
function drawHex(x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        let angle = (Math.PI / 3) * i;
        ctx.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle));
    }
    ctx.closePath();
    ctx.stroke();
}

// Animate the rotation when the toggle is clicked
function animateRotation(targetRotation) {
    let step = (targetRotation - currentRotation) / 30; // Divide the rotation into 30 frames
    function animate() {
        if (Math.abs(currentRotation - targetRotation) < 0.01) {
            currentRotation = targetRotation;
            if(showGrid) drawGrid(d);
            updateCanvas();
            return;
        }
        currentRotation += step;
        updateCanvas();
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

// Function to resize the canvas based on window width
function resizeCanvas() {

    const aspectRatio = 1.777777778; // 16:9 aspect ratio
    const width = cvs.offsetWidth;
    const height = width / aspectRatio;


    // Set the actual canvas size in memory (scaled by device pixel ratio)
    const scaleFactor = window.devicePixelRatio || 1;
    cWidth = cvs.width = width * scaleFactor;
    cHeight = cvs.height = height * scaleFactor;

    // Scale the drawing context to account for the device pixel ratio
    ctx.scale(scaleFactor, scaleFactor);

    // Redraw your content (replace this with your own drawing code)
    updateCanvas(); 
  }

// Function to draw the grid
function drawGrid(gridSize) {
    var x;
    var y;
    var p = []; // coordinates to draw the grid lines
    ctx.save();
    ctx.strokeStyle = 'rgba(120, 40, 80, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([d*0.05, d*0.05]);
    // Draw axial grid lines (q)
    for (let q = -100; q <= 100; q++) {
        [x,y] = hexToCart([q,0],d); // Convert axial coordinates to cartesian
        p = getLineCoord(x,y,90); // Get 2 cartesian points to draw a straight line at a specified angle
        ctx.beginPath();
        ctx.moveTo(p[0][0],p[0][1]);
        ctx.lineTo(p[1][0],p[1][1]);
        ctx.stroke();
    }
    // Draw axial grid lines (r)
    ctx.strokeStyle = 'rgba(40, 80, 210, 0.5)';
    for (let r = -100; r <= 100; r++) {
        [x,y] = hexToCart([0,r],d); // Convert axial coordinates to cartesian
        p = getLineCoord(x,y,30); // Get 2 cartesian points to draw a straight line at a specified angle
        ctx.beginPath();
        ctx.moveTo(p[0][0],p[0][1]);
        ctx.lineTo(p[1][0],p[1][1]);
        ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    [x,y] = hexToCart([0,0],d); // (q,r) = (0,0) Draw origin axis lines
    p = getLineCoord(x,y,0); // Get 2 cartesian points to draw a straight line at a specified angle
    ctx.beginPath();
    ctx.moveTo(p[0][0],p[0][1]);
    ctx.lineTo(p[1][0],p[1][1]);
    ctx.stroke();
    p = getLineCoord(x,y,120); // Get 2 cartesian points to draw a straight line at a specified angle
    ctx.beginPath();
    ctx.moveTo(p[0][0],p[0][1]);
    ctx.lineTo(p[1][0],p[1][1]);
    ctx.stroke();
    ctx.restore();
}

// Function to draw a single line touching (x,y) point and given an angle theta in degrees (counterclockwise)
function getLineCoord(x,y,theta){
    // Convert angle to radians
    const angle = theta * (Math.PI / 180);
    var p1 = [];
    var p2 = [];

    // Calculate two far points based on the angle. Due to rotation feature, allow for grid lines of double the size of canvas
    const x1 = theta == 90 ? x : x + ((-cHeight-y)/Math.tan(angle)); // (x1,0)
    const y1 = theta == 90 ? -cHeight : y + ((-cWidth-x)*Math.tan(angle)); // (0,y1)
    const x2 = theta == 90 ? x: x + ((cHeight-y)/Math.tan(angle)); // (x2,cHeight)
    const y2 = theta == 90 ? cHeight : y + ((cWidth-x)*Math.tan(angle)); // (cWidth,y2)

    p1 = (x1>=-cWidth) ? [x1,-cHeight] : [-cWidth,y1];
    p2 = (x2<=cWidth) ? [x2,cHeight] : [cWidth,y2];

    return [p1,p2];
}


// Add all event listeners
function addEventListeners(){
    // Initialize event listeners for sliders and text inputs
    const radiusSlider = document.getElementById('radiusSlider');
    const radiusInput = document.getElementById('radiusInput');
    const hexCountSlider = document.getElementById('hexCountSlider');
    const hexCountInput = document.getElementById('hexCountInput');
    const orientationToggle = document.getElementById('orientationToggle');
    const gridToggle = document.getElementById('gridToggle');

    // Event listeners for radius
    radiusSlider.addEventListener('input', function() {
        d = parseInt(this.value);
        radiusInput.value = d;
        updateCanvas();
    });
    radiusInput.addEventListener('input', function() {
        d = parseInt(this.value);
        radiusSlider.value = d;
        updateCanvas();
    });

    // Event listeners for number of hexagons
    hexCountSlider.addEventListener('input', function() {
        n = parseInt(this.value);
        hexCountInput.value = n;
        updateCanvas();
    });
    hexCountInput.addEventListener('input', function() {
        n = parseInt(this.value);
        hexCountSlider.value = n;
        updateCanvas();
    });

    // Event listener for orientation toggle
    orientationToggle.addEventListener('change', function() {
        oritentate = this.checked ? 1 : 0;
        animateRotation(oritentate ? Math.PI / 6 : 0); // Rotate by 30 degrees for pointy side
    });
    // Toggle grid visibility
    gridToggle.addEventListener('change', function (e) {
        showGrid = e.target.checked;
        gridToggle.checked = showGrid;
        updateCanvas(); // Redraw canvas with or without grid
    });

    // Window resize
    window.addEventListener('resize', resizeCanvas);

}
  