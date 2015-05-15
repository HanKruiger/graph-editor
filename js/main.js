var graph;
var running = true;

// Processing setup function
function setup() {
    var canvas = createCanvas(windowWidth * 0.8, 720);

    // Place the canvas in the HTML container.
    canvas.parent('canvas_container');

    // Link up the mousePressed function
    canvas.mousePressed(canvasMousePressed);

    graph = new Graph(createVector(width / 2, height / 2));
    
    // Add a vertex in the center.    
    graph.addVertex(createVector(width / 2, height / 2));
}

// Processing draw function
function draw() {
    // Make mouseIsPressed true only when the mouse is pressed in the canvas
    mouseIsPressed = mouseIsPressed && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;

    if (running) {
        background(192);
        graph.update();
        graph.display();
    }
}

// Processing keyTyped function
function keyTyped() {
    if (key === 'p') {
        running = !running;
    } else if (key == 'r' && graph.hasSelected()) {
        graph.removeSelected();
    }
    return false; // prevent any default behavior
}

// Called when the canvas is pressed.
function canvasMousePressed() {
    var mousePosition = createVector(mouseX, mouseY);
    if (keyIsDown(71) || keyIsDown(103)) { // 'g' or 'G'
        // Move the origin of gravitational attraction to the mouse position
        graph.moveGravity(mousePosition);
    } else if (keyIsDown(86) || keyIsDown(118)) { // 'v' or 'V'
        if (graph.hasSelectedVertex()) {
            // Add a vertex that is connected to the selected vertex. 
            graph.addVertexToSelected(mousePosition);
        } else {
            // Add a vertex without an edge
            graph.addVertex(mousePosition);
        }
    } else if (keyIsDown(69) || keyIsDown(101)) { // 'e' or 'E'
        if (graph.hasSelectedVertex()) {
            // Add an edge from the selected vertex to the clicked (if any) vertex.
            graph.addEdgeFromSelectedTo(mousePosition);
        }
    } else {
        graph.select(mousePosition);
    }
}
