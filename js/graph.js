function Graph(position) {
    this.origin = position.copy();
    this.vertices = [];
    this.edges = [];
    this.selectedVertex = null;
    this.selectedEdge = null;

    // Initial global parameters
    this.maxStepSize = 1;
    this.springConstant = 0.05;
    this.naturalSpringLength = 70;
    this.repulsionConstant = 800;
    this.touchRepulsionConstant = 80;
    this.gravityConstant = 0.1;
    this.noiseConstant = 1.5;

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
                "Spring constant", this.springConstant, 0.2, 'left', null, function(springConstant) {
                    // Change the prototype spring constant
                    Edge.prototype.springConstant = springConstant;
                }
            ),
        springLength:
            new Parameter(
                "Natural spring length", this.naturalSpringLength, 100, 'left', null, function(naturalSpringLength) {
                    // Change the prototype natural spring length
                    Edge.prototype.naturalSpringLength = naturalSpringLength;
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
                "Touch repulsion constant", this.touchRepulsionConstant, 100, 'left', this, function(touchRepulsionConstant) {
                    this.touchRepulsionConstant = touchRepulsionConstant;
                }
            ),
        gravityConstant:
            new Parameter(
                "Gravity constant", this.gravityConstant, 1, 'left', this, function(gravityConstant) {
                    this.gravityConstant = gravityConstant;
                }
            ),
        noiseConstant:
            new Parameter(
                "Noise constant", this.noiseConstant, 5, 'left', this, function(noiseConstant) {
                    this.noiseConstant = noiseConstant;
                }
            )
    };
}

// Add a vertex to the graph with initial position 'position'.
Graph.prototype.addVertex = function(position) {
    var vertex = new Vertex(position);
    this.vertices.push(vertex);
    return vertex;
};

// Add an edge between the two given vertices.
Graph.prototype.addEdge = function(v1, v2) {
    var edge = new Edge(v1, v2);
    this.edges.push(edge);
    v1.addLink(edge);
    v2.addLink(edge);
};

// Add an edge from the selected vertex to the clicked vertex
Graph.prototype.addEdgeFromSelectedTo = function(position) {
    var clickedVertex = this.getVertexAt(position);
    if (clickedVertex == this.selectedVertex) {
        // No self-edges: Do nothing
        return;
    } else if (clickedVertex === null) {
        // Clicked no vertex: Clear selection
        this.deselect();
    } else if (clickedVertex.hasNeighbour(this.selectedVertex)) {
        // Edge already existed: Select the other vertex
        this.selectVertex(clickedVertex);
    } else {
        // Add edge and select the other vertex
        this.addEdge(this.selectedVertex, clickedVertex);
        this.selectVertex(clickedVertex);
    }
}

// Adds a vertex with a connection to the selected vertex.
Graph.prototype.addVertexToSelected = function(position) {
    var v = new Vertex(position);
    this.vertices.push(v);
    this.addEdge(v, this.selectedVertex);

    // Remove selected vertex
    this.deselect();

    return v;
};

// Returns a vertex (if any) at position 'position'
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

// Returns an edge (if any) at position 'position'
Graph.prototype.getEdgeAt = function(position) {
    if (this.edges.length == 0) return null;
    var closestEdge = this.edges[0];
    var minDistance = closestEdge.distanceTo(position);
    for (var i = 1; i < this.edges.length; i++) {
        var e = this.edges[i];
        var distance = e.distanceTo(position);
        if (distance < minDistance) {
            minDistance = distance;
            closestEdge = e;
        }
    }
    if (minDistance < 10 /* tolerance */) return closestEdge;
    return null;
}

// Select the entity (if any) that is clicked.
Graph.prototype.select = function(position) {
    // First, deselect everything. To prevent unwanted behaviour.
    this.deselect();
    var clickedVertex = this.getVertexAt(position);
    if (clickedVertex !== null) {
        this.selectVertex(clickedVertex);
        return;
    }
    var clickedEdge = this.getEdgeAt(position);
    if (clickedEdge !== null) {
        this.selectEdge(clickedEdge);
        return;
    }
};

Graph.prototype.hasSelected = function() {
    return this.hasSelectedVertex() || this.hasSelectedEdge();
};

Graph.prototype.hasSelectedVertex = function() {
    return this.selectedVertex !== null;
};

Graph.prototype.hasSelectedEdge = function() {
    return this.selectedEdge !== null;
};

// Remove selection
Graph.prototype.deselect = function() {
    this.selectedVertex = null;
    this.selectedEdge = null;
    if (this.parameters.selected != null) {
        this.parameters.selected.remove();
        delete this.parameters.selected;
    }
}

// Select vertex 'v'.
Graph.prototype.selectVertex = function(v) {
    this.deselect();
    this.selectedVertex = v;
    this.parameters.selected = new Parameter(
        "Radius", v.radius, 64, 'right', v, function(radius) {
            this.radius = radius;
        }
    );
}

// Select edge 'e'.
Graph.prototype.selectEdge = function(e) {
    this.deselect();
    this.selectedEdge = e;
    this.parameters.selected = new Parameter(
        "Natural spring length", e.naturalSpringLength, 150, 'right', e, function(l) {
            this.naturalSpringLength = l;
        }
    );
};

// Remove the selected entity, and clean up all its links/edges.
Graph.prototype.removeSelected = function() {
    var i = this.vertices.indexOf(this.selectedVertex);
    if (i >= 0) {
        var removeMe = this.vertices[i];
        var edgesToRemove = removeMe.links;
        // Loop over edges connected to vertex that is being removed.
        for (var j = 0; j < edgesToRemove.length; j++) {
            var k = this.edges.indexOf(edgesToRemove[j]);
            if (k >= 0) {
                // Remove edge from array
                this.edges.splice(k, 1);
            } else {
                console.error("Couldn't find edge that I should have been able to find!");
            }
        }
        // Removes links from its neighbours.
        removeMe.remove();

        // Remove vertex from array
        this.vertices.splice(i, 1);

        this.deselect();
        return;
    }
    // There was no selected vertex, so look for a selected edge.
    i = this.edges.indexOf(this.selectedEdge);
    if (i >= 0) {
        var removeMe = this.edges[i];
        removeMe.remove();
        this.edges.splice(i, 1);

        this.deselect();
        return;
    }
    console.error("Couldn't find selected entity to remove!");
}

Graph.prototype.dragTo = function(position) {
    if (this.selectedVertex !== null) {
        this.selectedVertex.moveTo(position);
    }
}

Graph.prototype.moveGravity = function(position) {
    this.origin = position.copy();
};

// Update all vertices and edges.
Graph.prototype.update = function() {
    for (i = 0; i < this.edges.length; i++) {
        this.edges[i].update();
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
                // Additional force to prevent overlapping vertices, which is only active when the vertices touch.
                var touchForce = p5.Vector.sub(v2.position, v1.position).setMag(this.touchRepulsionConstant);
                v2.applyForce(touchForce);
            }
        }

        // Social gravity (simply scaled by number of connections)
        var gravForce = p5.Vector.sub(this.origin, v1.position).setMag(this.gravityConstant * (v1.links.length + 1));
        v1.applyForce(gravForce);

        // Random noise force, for float-like effect
        v1.applyNoiseForce(this.noiseConstant);

        // USE THE FORCE
        v1.update(this.maxStepSize);
    }

    if (this.hasSelectedVertex() && mouseIsPressed) {
        this.selectedVertex.moveTo(createVector(mouseX, mouseY));
    }
};

// Display all vertices and edges.
Graph.prototype.display = function() {
    for (var i = 0; i < this.edges.length; i++) {
        this.edges[i].display(this.selectedEdge === this.edges[i]);
    }

    for (i = 0; i < this.vertices.length; i++) {
        this.vertices[i].display(this.selectedVertex === this.vertices[i]);
    }
};
