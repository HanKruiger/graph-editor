var graph;
var running = true;

// Processing setup function
function setup() {
    var canvas = createCanvas(1280, 720);

    // Place the canvas in the HTML container.
    canvas.parent('canvascontainer');

    var params = {
        step_size: new Parameter("Step size", 1, 20, Parameter.orientationEnum.NORTH_WEST),
        spring_constant: new Parameter("Spring constant", 0.1, 0.2, Parameter.orientationEnum.NORTH_WEST),
        spring_length: new Parameter("Natural spring length", 40, 100, Parameter.orientationEnum.NORTH_WEST),
        repulsion_constant: new Parameter("Repulsion constant", 800, 2000, Parameter.orientationEnum.NORTH_WEST),
        gravity_constant: new Parameter("Gravity constant", 1, 5, Parameter.orientationEnum.NORTH_WEST),
    };

    graph = new Graph(createVector(width / 2, height / 2), params);
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
