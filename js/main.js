var graph;
var running = true;

// Processing setup function
function setup() {
    createCanvas(1280, 720);

    var params = {
        step_size: new Parameter("step_size", 1, 20),
        spring_constant: new Parameter("spring_constant", 0.1, 0.2),
        spring_length: new Parameter("spring_length", 40, 100),
        repulsion_constant: new Parameter("repulsion_constant", 800, 2000),
        gravity_constant: new Parameter("gravity_constant", 1, 5),
    };

    graph = new Graph(createVector(width / 2, height / 2), params);
    graph.addVertex();
    graph.addRandomVertexWithEdge();
}

// Processing draw function
function draw() {
    background(200);
    if (running) {
        graph.update();
        graph.display();
    }
}

function keyTyped() {
    if (key === 'v') {
        graph.addRandomVertexWithEdge();
    } else if (key === 'p') {
        running = !running;
    }
    return false; // prevent any default behavior
}