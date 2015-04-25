function Graph(_position, _params) {
    this.origin = _position.copy();
    this.params = _params;
    this.vertices = [];
    this.edges = [];
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
    // this.origin = createVector(mouseX, mouseY); <-- Could be interesting.
    for (i = 0; i < this.edges.length; i++) {
        this.edges[i].update(this.params.spring_length.value(), this.params.spring_constant.value());
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
            var force = p5.Vector.sub(v2.position, v1.position).setMag(this.params.repulsion_constant.value() / (distance * distance));
            v2.applyForce(force);
        }

        // Social gravity (simply scaled by number of connections)
        var grav_force = p5.Vector.sub(graph.origin, v1.position).setMag(this.params.gravity_constant.value() * v1.neighbours.length);
        v1.applyForce(grav_force);

        // USE THE FORCE
        this.vertices[i].update(this.params.step_size.value());
    }
};

// Display all vertices and edges.
Graph.prototype.display = function() {
    for (var i = 0; i < this.edges.length; i++) {
        this.edges[i].display();
    }
    for (i = 0; i < this.vertices.length; i++) {
        this.vertices[i].display();
    }

    strokeWeight(0);
    for (var param in this.params) {
        this.params[param].display();
    }
};
