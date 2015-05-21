function Graph(position) {
    // origin in canvas coordinates
    this.origin = position;
    this.gravitySource = new Vec2(0, 0);
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

    // Slider objects live here. And perhaps other setting setters.
    this.settings = [
        new Slider(
            "Maximum step size", this.maxStepSize, 0, 20, 'left', this, function(maxStepSize) {
                this.maxStepSize = maxStepSize;
            }
        ),
        new Slider(
            "Spring constant", this.springConstant, 0, 0.2, 'left', null, function(springConstant) {
                // Change the prototype spring constant
                Edge.prototype.springConstant = springConstant;
            }
        ),
        new Slider(
            "Natural spring length", this.naturalSpringLength, 0, 100, 'left', null, function(naturalSpringLength) {
                // Change the prototype natural spring length
                Edge.prototype.naturalSpringLength = naturalSpringLength;
            }
        ),
        new Slider(
            "Repulsion constant", this.repulsionConstant, 0, 1000, 'left', this, function(repulsionConstant) {
                this.repulsionConstant = repulsionConstant;
            }
        ),
        new Slider(
            "Touch repulsion constant", this.touchRepulsionConstant, 0, 100, 'left', this, function(touchRepulsionConstant) {
                this.touchRepulsionConstant = touchRepulsionConstant;
            }
        ),
        new Slider(
            "Gravity constant", this.gravityConstant, 0, 1, 'left', this, function(gravityConstant) {
                this.gravityConstant = gravityConstant;
            }
        ),
        new Slider(
            "Noise constant", this.noiseConstant, 0, 5, 'left', this, function(noiseConstant) {
                this.noiseConstant = noiseConstant;
            }
        )
    ];

    this.selectionSettings = [];
}

Graph.prototype.initEventRedirects = function(ih) {
    this.ih = ih;
    ih.registerClickRedirect("left", [86/*V*/], [], this.addVertex, this);
    ih.registerClickRedirect("left", [71/*G*/], [], this.moveGravity, this);
    ih.registerClickRedirect("left", [], [], this.select, this);
    ih.registerClickRedirect("left", [69/*E*/], [], this.addEdgeFromSelectedTo, this);

    ih.registerKeyDownRedirect(82 /*R*/, [], [], this.removeSelected, this);
}

// Add a vertex to the graph with initial position 'position'.
Graph.prototype.addVertex = function(position) {
    if (this.hasSelectedVertex()) {
        /* If a vertex is selected, add the new vertex to the selected. */
        return this.addVertexToSelected(position);
    }
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
        var distance = position.dist(v.position);
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
    if (this.hasSelectedEdge()) {
        this.selectedEdge.deselect();
    }
    if (this.hasSelectedVertex()) {
        this.selectedVertex.deselect();
    }

    this.selectedVertex = null;
    this.selectedEdge = null;
    // Remove sliders made for the selection.
    for (var i = 0; i < this.selectionSettings.length; i++) {
        this.selectionSettings[i].remove();
    }
    this.selectionSettings = [];
}

// Select vertex 'v'.
Graph.prototype.selectVertex = function(v) {
    this.deselect();
    this.selectedVertex = v;
    this.selectionSettings.push(new Slider(
        "Radius", v.radius, 16, 32, 'right', v, function(radius) {
            this.radius = radius;
        }
    ));
    v.select();
}

// Select edge 'e'.
Graph.prototype.selectEdge = function(e) {
    this.deselect();
    this.selectedEdge = e;
    this.selectionSettings.push(
        new Slider(
            "Natural spring length", e.naturalSpringLength, 0, 150, 'right', e, function(naturalSpringLength) {
                this.naturalSpringLength = naturalSpringLength;
            }
        ), new Slider(
            "Spring constant", e.springConstant, 0, 2, 'right', e, function(springConstant) {
                this.springConstant = springConstant;
            }
        )
    );
    e.select();
};

// Remove the selected entity, and clean up all its links/edges.
Graph.prototype.removeSelected = function() {
    if (this.hasSelectedVertex()) {
        var removeMe = this.selectedVertex;
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
        var i = this.vertices.indexOf(this.selectedVertex);
        assert(i >= 0);
        this.vertices.splice(i, 1);

        this.deselect();
        return;
    }
    // There was no selected vertex, so look for a selected edge.
    if (this.hasSelectedEdge()) {
        var removeMe = this.selectedEdge;
        removeMe.remove();
        
        var i = this.edges.indexOf(this.selectedEdge);
        assert(i >= 0);
        this.edges.splice(i, 1);

        this.deselect();
        return;
    }
    console.log("Couldn't find selected entity to remove!");
}

Graph.prototype.dragTo = function(position) {
    if (this.selectedVertex !== null) {
        this.selectedVertex.moveTo(position);
    }
}

Graph.prototype.moveGravity = function(position) {
    this.gravitySource = position.copy();
};

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
            var distance = v2.position.dist(v1.position);
            var force = v2.position.copy().sub(v1.position).constrain(0, this.repulsionConstant / (distance * distance));
            v2.applyForce(force);

            if (distance < v1.radius + v2.radius) {
                // Additional force to prevent overlapping vertices, which is only active when the vertices touch.
                var touchForce = v2.position.copy().sub(v1.position).constrain(0, this.touchRepulsionConstant);
                v2.applyForce(touchForce);
            }
        }

        // Social gravity (simply scaled by number of connections)
        var gravForce = this.gravitySource.copy().sub(v1.position).constrain(0, this.gravityConstant * (v1.links.length + 1));
        v1.applyForce(gravForce);

        // Random noise force, for float-like effect
        v1.applyNoiseForce(this.noiseConstant);

        // USE THE FORCE
        v1.update(this.maxStepSize);
    }

    if (this.hasSelectedVertex() && this.ih.isMousePressed('left')) {
        this.selectedVertex.moveTo(this.ih.mouse);
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


// Draw all vertices and edges.
Graph.prototype.draw = function(ctx) {
    ctx.save();
    // Translate to the center of the canvas.
    ctx.translate(this.origin.x, this.origin.y);
    for (var i = 0; i < this.edges.length; i++) {
        this.edges[i].draw(ctx);
    }

    for (i = 0; i < this.vertices.length; i++) {
        this.vertices[i].draw(ctx);
    }
    ctx.restore();
};
