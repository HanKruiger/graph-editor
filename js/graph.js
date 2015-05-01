function Graph(_position) {
    this.origin = _position.copy();
    this.vertices = [];
    this.edges = [];
    this.selected = null;

    // Initial global parameters
    this.step_size = 1;
    this.spring_constant = 0.1;
    this.spring_length = 40;
    this.repulsion_constant = 800;
    this.gravity_constant = 1;

    this.params = {
        step_size:
            new Parameter(
                "Step size", this.step_size, 20, Parameter.orientationEnum.NORTH_WEST, this, function(step_size) {
                    this.step_size = step_size;
                }
            ),
        spring_constant:
            new Parameter(
                "Spring constant", 0.1, 0.2, Parameter.orientationEnum.NORTH_WEST, this, function(spring_constant) {
                    this.spring_constant = spring_constant;
                }
            ),
        spring_length:
            new Parameter(
                "Natural spring length", 40, 100, Parameter.orientationEnum.NORTH_WEST, this, function(spring_length) {
                    this.spring_length = spring_length;
                }
            ),
        repulsion_constant:
            new Parameter(
                "Repulsion constant", 800, 2000, Parameter.orientationEnum.NORTH_WEST, this, function(repulsion_constant) {
                    this.repulsion_constant = repulsion_constant;
                }
            ),
        gravity_constant:
            new Parameter(
                "Gravity constant", 1, 5, Parameter.orientationEnum.NORTH_WEST, this, function(gravity_constant) {
                    this.gravity_constant = gravity_constant;
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

// Return a random vertex from the graph.
Graph.prototype.getRandomVertex = function() {
    var i = int(random(this.vertices.length - 1));
    return this.vertices[i];
};

// Adds a vertex to a random other vertex in the graph, and an edge representing this relation.
Graph.prototype.addRandomVertexWithEdge = function() {
    var v1 = this.addVertex();
    var v2 = this.getRandomVertex();
    this.edges.push(new Edge(v1, v2));

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

Graph.prototype.select = function(position) {
    for (var i = 0; i < this.vertices.length; i++) {
        var v = this.vertices[i];
        var distance = p5.Vector.dist(position, v.position);
        if (distance < v.radius) {
            this.selected = v;
            console.log('Selected vertex ' + i);
            return;
        }
    }
    // Remove selection when nothing was clicked.
    this.selected = null;
};

Graph.prototype.hasSelected = function() {
    return this.selected !== null;
};

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
        this.edges[i].update(this.spring_length, this.spring_constant);
    }
    for (i = 0; i < this.vertices.length; i++) {
        var v1 = this.vertices[i];
        // Normal global repulsion
        for (var j = 0; j < this.vertices.length; j++) {
            if (j === i) {
                continue;
            }
            var v2 = this.vertices[j];
            var distance = p5.Vector.dist(v2.position, v1.position);
            var force = p5.Vector.sub(v2.position, v1.position).setMag(this.repulsion_constant / (distance * distance));
            v2.applyForce(force);
        }

        // Social gravity (simply scaled by number of connections)
        var grav_force = p5.Vector.sub(this.origin, v1.position).setMag(this.gravity_constant * v1.neighbours.length);
        v1.applyForce(grav_force);

        // USE THE FORCE
        this.vertices[i].update(this.step_size);
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

    // Draw the parameter texts in black.
    fill(0);
    strokeWeight(0);
    for (var param in this.params) {
        this.params[param].display();
    }
};
