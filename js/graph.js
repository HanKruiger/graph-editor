function Graph(position) {
    this.origin = position.copy();
    this.vertices = [];
    this.edges = [];
    this.selected = null;

    // Initial global parameters
    this.maxStepSize = 1;
    this.springConstant = 0.05;
    this.springLength = 70;
    this.repulsionConstant = 800;
    this.touchRepulsionConstant = 80;
    this.gravityConstant = 0.1;

    // Parameter objects live in the parameters object, which is a simple container.
    this.parameters = {
        maxStepSize:
            new Parameter(
                "Maximum step size", this.maxStepSize, 20, 'left', this, function(maxStepSize) {
                    this.maxStepSize = maxStepSize;
                }
            ),
        springConstant:
            new Parameter(
                "Spring constant", this.springConstant, 0.2, 'left', this, function(springConstant) {
                    this.springConstant = springConstant;
                }
            ),
        springLength:
            new Parameter(
                "Natural spring length", this.springLength, 100, 'left', this, function(springLength) {
                    this.springLength = springLength;
                }
            ),
        repulsionConstant:
            new Parameter(
                "Repulsion constant", this.repulsionConstant, 1000, 'left', this, function(repulsionConstant) {
                    this.repulsionConstant = repulsionConstant;
                }
            ),
        touchRepulsionConstant:
            new Parameter(
                "Touch repulsion constant", this.touchRepulsionConstant, 1000, 'left', this, function(touchRepulsionConstant) {
                    this.touchRepulsionConstant = touchRepulsionConstant;
                }
            ),
        gravityConstant:
            new Parameter(
                "Gravity constant", this.gravityConstant, 5, 'left', this, function(gravityConstant) {
                    this.gravityConstant = gravityConstant;
                }
            )
    };
}

// Add a vertex to the graph. Assign it a random position on the screen.
Graph.prototype.addVertex = function() {
    var vertex = new Vertex(createVector(random(width), random(height)));
    this.vertices.push(vertex);
    return vertex;
};

// Add an edge between the two given vertices.
Graph.prototype.addEdge = function(v1, v2) {
    this.edges.push(new Edge(v1, v2));
};

Graph.prototype.addEdgeFromSelectedTo = function(position) {
    var clickedVertex = this.getVertexAt(position);
    if (clickedVertex == this.selected) {
        console.log('Tried to add self-edge!');
    } else if (clickedVertex === null) {
        console.log('Tried to add edge to nothing!')
        this.deselect();
    } else if (clickedVertex.hasNeighbour(this.selected)) {
        console.log('Tried to add edge that already existed!')
        this.selectVertex(clickedVertex);
    } else {
        console.log('Adding edge between vertices.');
        this.addEdge(this.selected, clickedVertex);
        this.selected.addLink(clickedVertex);
        clickedVertex.addLink(this.selected);

        this.selectVertex(clickedVertex);
    }
}

// Return a random vertex from the graph.
Graph.prototype.getRandomVertex = function() {
    var i = int(random(this.vertices.length - 1));
    return this.vertices[i];
};

// Adds a vertex to a random other vertex in the graph, and an edge representing this relation.
Graph.prototype.addRandomVertexWithEdge = function() {
    var v1 = this.addVertex();
    var v2 = this.getRandomVertex();
    this.addEdge(v1, v2);

    // Add links to respective vertices.
    v1.addLink(v2);
    v2.addLink(v1);

    return v1;
};

Graph.prototype.addVertexToClosest = function(position) {
    var v1 = new Vertex(position);
    var v2 = this.vertices[0];
    var distance = p5.Vector.dist(v1.position, v2.position);
    for (var i = 1; i < this.vertices.length; i++) {
        var newDistance = p5.Vector.dist(v1.position, this.vertices[i].position);
        if (newDistance < distance) {
            v2 = this.vertices[i];
            distance = newDistance;
        }
    }
    this.vertices.push(v1);
    this.addEdge(v1, v2);

    // Add links to respective vertices.
    v1.addLink(v2);
    v2.addLink(v1);

    return v1;
};

Graph.prototype.addVertexToSelected = function() {
    var v = new Vertex(this.selected.position);
    this.vertices.push(v);
    this.addEdge(v, this.selected);
    return v;
};

Graph.prototype.getVertexAt = function(position) {
    for (var i = 0; i < this.vertices.length; i++) {
        var v = this.vertices[i];
        var distance = p5.Vector.dist(position, v.position);
        if (distance < v.radius) {
            return v;
        }
    }
    return null;
}

Graph.prototype.select = function(position) {
    var clickedVertex = this.getVertexAt(position);
    if (clickedVertex !== null) {
        this.selectVertex(clickedVertex);
    } else {
        // Remove selection when nothing was clicked.
        this.deselect();
    }
};

Graph.prototype.hasSelected = function() {
    return this.selected !== null;
};

Graph.prototype.deselect = function() {
    this.selected = null;
    if (this.parameters.selected != null) {
        this.parameters.selected.remove();
        delete this.parameters.selected;
    }
}

Graph.prototype.selectVertex = function(v) {
    this.selected = v;
    if (this.parameters.selected != null) {
        this.parameters.selected.remove();
        delete this.parameters.selected;
    }
    this.parameters.selected = new Parameter(
        "Radius", v.radius, 64, 'right', v, function(radius) {
            this.radius = radius;
        }
    );
}

Graph.prototype.dragTo = function(position) {
    if (this.selected !== null) {
        this.selected.moveTo(position);
    }
}

Graph.prototype.moveGravity = function(position) {
    this.origin = position.copy();
};

// Update all vertices and edges.
Graph.prototype.update = function() {
    for (i = 0; i < this.edges.length; i++) {
        this.edges[i].update(this.springLength, this.springConstant);
    }
    for (i = 0; i < this.vertices.length; i++) {
        var v1 = this.vertices[i];
        for (var j = 0; j < this.vertices.length; j++) {
            if (j === i) {
                continue;
            }
            // Normal global repulsion
            var v2 = this.vertices[j];
            var distance = p5.Vector.dist(v2.position, v1.position);
            var force = p5.Vector.sub(v2.position, v1.position).setMag(this.repulsionConstant / (distance * distance));
            v2.applyForce(force);

            if (distance < v1.radius + v2.radius) {
                // Additional force to prevent overlapping vertices, inversely proportional to distance to the fourth power.
                // This should blow up fast enough to prevent overlap, right?
                // var touchForce = p5.Vector.sub(v2.position, v1.position).setMag(this.touchRepulsionConstant / (Math.pow(distance, 10)));
                var touchForce = p5.Vector.sub(v2.position, v1.position).setMag(this.touchRepulsionConstant);
                v2.applyForce(touchForce);
            }
        }

        // Social gravity (simply scaled by number of connections)
        var gravForce = p5.Vector.sub(this.origin, v1.position).setMag(this.gravityConstant * v1.neighbours.length);
        v1.applyForce(gravForce);

        // USE THE FORCE
        this.vertices[i].update(this.maxStepSize);
    }

    if (this.hasSelected() && mouseIsPressed) {
        this.selected.moveTo(createVector(mouseX, mouseY));
    }
};

// Display all vertices and edges.
Graph.prototype.display = function() {
    stroke(0);
    strokeWeight(2);
    for (var i = 0; i < this.edges.length; i++) {
        this.edges[i].display();
    }
    
    for (i = 0; i < this.vertices.length; i++) {
        if (this.selected === this.vertices[i]) {
            fill(255);
        } else {
            fill(128);
        }
        this.vertices[i].display();
    }
};
