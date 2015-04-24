var sketch = function(p) {
    var graph;

    var running = true;

    var stepSize = 1, maxStepSize = 10;

    // Spring parameters and sliders
    var springSlider;
    var springConstant = 1, maxSpringConstant = 0.2;
    var naturalLength = 40, maxNaturalLength = 100;

    // Repulsion parameters
    var repulsionSlider;
    var repulsionConstant = 800, maxRepulsionConstant = 2000;

    // Gravity parameters
    var gravitySlider;
    var gravityConstant = 1, maxGravityConstant = 5;

    // Processing setup function
    p.setup = function() {
        p.createCanvas(1280, 720);
        graph = new Graph(p.createVector(p.width / 2, p.height / 2));
        graph.addVertex();
        graph.addRandomVertexWithEdge();
        // console.log(p.createVector(0, 0).mag());
        // var v2 = graph.addVertex();
        // graph.addEdge(v1, v2);

        stepSizeSlider = p.createSlider(0, 100, stepSize * 100 / maxStepSize);
        stepSizeSlider.position(20, 20);
        springSlider = p.createSlider(0, 100, springConstant * 100 / maxSpringConstant);
        springSlider.position(20, 50);
        springLengthSlider = p.createSlider(0, 100, naturalLength * 100 / maxNaturalLength);
        springLengthSlider.position(20, 80);
        repulsionSlider = p.createSlider(0, 100, repulsionConstant * 100 / maxRepulsionConstant);
        repulsionSlider.position(20, 110);
        gravitySlider = p.createSlider(0, 100, gravityConstant * 100 / maxGravityConstant);
        gravitySlider.position(20, 140);
    }

    // Processing draw function
    p.draw = function() {
        updateParameters();
        p.background(200);
        if (running) {
            graph.update();
            graph.display();
        }
        drawSliderText();
    }

    p.keyTyped = function() {
        if (p.key === 'v') {
            graph.addRandomVertexWithEdge();
        } else if (p.key === 'p') {
            running = !running;
        }
        return false; // prevent any default behavior
    }

    updateParameters = function() {
        stepSize            = stepSizeSlider.value()        * maxStepSize           / 100.0;
        springConstant      = springSlider.value()          * maxSpringConstant     / 100.0;
        naturalLength       = springLengthSlider.value()    * maxNaturalLength      / 100.0;
        repulsionConstant   = repulsionSlider.value()       * maxRepulsionConstant  / 100.0;
        gravityConstant     = gravitySlider.value()         * maxGravityConstant    / 100.0;
    }

    drawSliderText = function() {
        p.strokeWeight(0);
        p.text("Step size: " + stepSize, 165, 35);
        p.text("Spring strength: " + springConstant, 165, 65);
        p.text("Spring natural length: " + naturalLength, 165, 95);
        p.text("Repulsion strength: " + repulsionConstant, 165, 125);
        p.text("Gravity strength: " + gravityConstant, 165, 155);
    }

    // A simple Vertex class
    function Vertex(position) {
        this.position = position.copy();
        this.force = p.createVector(0, 0);
        this.neighbours = [];
    }

    // Apply a force to the vertex
    Vertex.prototype.applyForce = function(force) {
        this.force.add(force);
    }

    // Add another vertex to the list of neighbours
    Vertex.prototype.addLink = function(neighbour) {
        this.neighbours.push(neighbour);
    };

    // Method to update position
    Vertex.prototype.update = function() {
        if (this.force.mag() != 0) {
            this.position.add(this.force.setMag(stepSize));
            this.force = p.createVector(0, 0);
        }
    };

    // Method to display
    Vertex.prototype.display = function() {
        p.stroke(0);
        p.strokeWeight(2);
        p.fill(128);
        p.ellipse(this.position.x, this.position.y, 12, 12);
    };

    // A simple Edge class.
    function Edge(v1, v2, weight) {
        this.v1 = v1;
        this.v2 = v2;
        this.weight = weight;
    }

    // Update the vertices that this edge connects.
    Edge.prototype.update = function() {
        var p1 = this.v1.position;
        var p2 = this.v2.position;

        // Negative when contracted, positive when extended
        var extension = p5.Vector.dist(p1, p2) - naturalLength;
        var force = p5.Vector.sub(p2, p1).setMag(extension * springConstant);

        this.v1.applyForce(force);
        this.v2.applyForce(force.mult(-1));
    };

    // Draw a line to display the edge
    Edge.prototype.display = function() {
        p.line(this.v1.position.x, this.v1.position.y, this.v2.position.x, this.v2.position.y);
    };

    // Graph class
    function Graph(position) {
        this.origin = position.copy();
        this.vertices = [];
        this.edges = [];
    }

    // Add a vertex to the graph. Assign it a random position on the screen.
    Graph.prototype.addVertex = function() {
        var vertex = new Vertex(p.createVector(p.random(p.width), p.random(p.height)));
        this.vertices.push(vertex);
        return vertex;
    };

    // Add an edge between the two given vertices.
    Graph.prototype.addEdge = function(v1, v2) {
        this.edges.push(new Edge(v1, v2));
    };

    // Return a random vertex from the graph.
    Graph.prototype.getRandomVertex = function() {
        var i = p.int(p.random(this.vertices.length - 1));
        return this.vertices[i];
    };

    // Adds a vertex to a random other vertex in the graph, and an edge representing this relation.
    Graph.prototype.addRandomVertexWithEdge = function() {
        var v1 = this.getRandomVertex();
        var v2 = this.addVertex();
        this.edges.push(new Edge(v1, v2));

        // Add links to respective vertices.
        v1.addLink(v2);
        v2.addLink(v1);

        return v2;
    };

    // Update all vertices and edges.
    Graph.prototype.update = function() {
        // this.origin = p.createVector(p.mouseX, p.mouseY); <-- Could be interesting.
        for (var i = 0; i < this.edges.length; i++) {
            this.edges[i].update();
        }
        for (var i = 0; i < this.vertices.length; i++) {
            v1 = this.vertices[i];
            // Normal global repulsion
            for (var j = 0; j < this.vertices.length; j++) {
                if (j == i)
                    continue;
                var v2 = this.vertices[j];
                var distance = p5.Vector.dist(v2.position, v1.position);
                var force = p5.Vector.sub(v2.position, v1.position).setMag(repulsionConstant / (distance * distance));
                v2.applyForce(force);
            }

            // Social gravity (simply scaled by number of connections)
            var force = p5.Vector.sub(graph.origin, v1.position).setMag(gravityConstant * v1.neighbours.length);
            v1.applyForce(force);

            // USE THE FORCE
            this.vertices[i].update();
        }
    };

    // Display all vertices and edges.
    Graph.prototype.display = function() {
        for (var i = 0; i < this.edges.length; i++) {
            this.edges[i].display();
        }
        for (var i = 0; i < this.vertices.length; i++) {
            this.vertices[i].display();
        }
    };
};

// Make a p5 object that draws all the stuff.
// This keeps all p5 objects out of the global scope.
var myp5 = new p5(sketch);
