var graph;
var running = true;

// Processing setup function
function setup() {
    var canvas = createCanvas(1280, 720);

    // Place the canvas in the HTML container.
    canvas.parent('canvascontainer');

    graph = new Graph(createVector(width / 2, height / 2));
    graph.addVertex();
    graph.addRandomVertexWithEdge();
}

// Processing draw function
function draw() {
    if (running) {
        background(200);
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

// Processing mousePressed function
function mousePressed() {
    if (keyIsDown(71) || keyIsDown(103)) { // 'g' or 'G'
        graph.moveGravity(createVector(mouseX, mouseY));
    } else if (keyIsDown(86) || keyIsDown(118)) { // 'v' or 'V'
        if (!graph.hasSelected()) {
            graph.addVertexToClosest(createVector(mouseX, mouseY));
        } else {
            graph.addVertexToSelected();
        }
    } else {
        graph.select(createVector(mouseX, mouseY));
    }
}
