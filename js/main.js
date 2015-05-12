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
    
    // Add a vertex in a random position.    
    graph.addVertex();

    // Add 9 more vertices to random other vertices.
    // for (var i = 0; i < 10; i++) {
    //     graph.addRandomVertexWithEdge();
    // }
}

// Processing draw function
function draw() {
    // A little hack to make mouseIsPressed true only when the mouse it pressed in the canvas
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
    }
    return false; // prevent any default behavior
}

// Called when the canvas is pressed.
function canvasMousePressed() {
    if (keyIsDown(71) || keyIsDown(103)) { // 'g' or 'G'
        graph.moveGravity(createVector(mouseX, mouseY));
    } else if (keyIsDown(86) || keyIsDown(118)) { // 'v' or 'V'
        if (!graph.hasSelected()) {
            graph.addVertexToClosest(createVector(mouseX, mouseY));
        } else {
            graph.addVertexToSelected();
        }
    } else if (keyIsDown(69) || keyIsDown(101)) { // 'e' or 'E'
        if (graph.hasSelected()) {
            graph.addEdgeFromSelectedTo(createVector(mouseX, mouseY));
        }
    } else {
        graph.select(createVector(mouseX, mouseY));
    }
}
