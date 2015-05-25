function World() {
    this.gravitySource = new Vec2(0, 0);
    this.graphs = [];

    // Initialise the user graph
    this.userGraph = new UserGraph(this);
    this.userGraph.addVertex(new Vec2(2, 2));
    this.graphs.push(this.userGraph);

    // Initialise some graph that the user has no control over
    var someGraph = new Graph(this);
    someGraph.addVertex(new Vec2(200 * Math.random(), 200 * Math.random()));
    this.graphs.push(someGraph);

    this.selection = [];

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
}

World.prototype.initEventRedirects = function(ih) {
    this.ih = ih;
    ih.registerClickRedirect("left", [], [], this.reselect, this);
    ih.registerClickRedirect("left", [17/*CTRL*/], [], this.select, this);
    ih.registerClickRedirect("left", [69/*E*/], [], this.addEdgeFromSelectedTo, this);
    ih.registerClickRedirect("left", [71/*G*/], [], this.moveGravity, this);

    ih.registerKeyDownRedirect(82 /*R*/, [], [], this.removeSelected, this);

    this.userGraph.initEventRedirects(ih);
}

// Add an edge from the selected vertex to the clicked vertex
World.prototype.addEdgeFromSelectedTo = function(position) {
	if (this.selection.length == 0) {
        // There was no selected vertex: Do nothing
		return;
	}

    var clicked = this.getVertexAt(position);
    if (clicked === null) {
    	// Clicked nothing: Deselect and return.
    	this.deselect();
    	return;
    }
    if (!(clicked.graph instanceof UserGraph)) {
    	// Clicked vertex not belonging to user graph:
    	// Select just that vertex and return.
    	this.deselect();
    	this.selectVertex(clicked);
    	return;
    }
	for (var i = 0; i < this.selection.length; i++) {
		var selected = this.selection[i];
		if (!(selected instanceof Vertex)) continue;

        // Self edge
	    if (clicked == selected) continue;

        // Edge already exists
	    if (clicked.hasNeighbour(selected)) continue;
	    
	    // Selected vertex is from other graph
	    if (!(selected.graph instanceof UserGraph)) continue;

        // Otherwise, add edge.
        selected.graph.addEdge(selected, clicked);
	}
    this.selectVertex(clicked);
}

/* Get vertices from all graphs and concatenate them */
World.prototype.getVertices = function() {
    var vertices = [];
    for (var i = 0; i < this.graphs.length; i++) {
        var graph = this.graphs[i];
        vertices = vertices.concat(graph.vertices);
    }
    return vertices;
}

/* Get edges from all graphs and concatenate them */
World.prototype.getEdges = function() {
	var edges = [];
	for (var i = 0; i < this.graphs.length; i++) {
		var graph = this.graphs[i];
		edges = edges.concat(graph.edges);
	}
	return edges;
}

// Returns a vertex (if any) at position 'position'
World.prototype.getVertexAt = function(position) {
	var vertices = this.getVertices();
    for (var i = 0; i < vertices.length; i++) {
        var v = vertices[i];
        var distance = position.dist(v.position);
        if (distance < v.radius) {
            return v;
        }
    }
    return null;
}

// Returns an edge (if any) at position 'position'
World.prototype.getEdgeAt = function(position) {
	var edges = this.getEdges();
    if (edges.length == 0) return null;
    var closestEdge = edges[0];
    var minDistance = closestEdge.distanceTo(position);
    for (var i = 1; i < edges.length; i++) {
        var e = edges[i];
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
World.prototype.reselect = function(position) {
    // First, deselect everything.
    this.deselect();
    this.select(position);
};

// Select the entity (if any) that is clicked.
World.prototype.select = function(position) {
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

World.prototype.hasSelection = function() {
    return this.selection.length > 0;
};

// Remove selection
World.prototype.deselect = function() {
	for (var i = 0; i < this.selection.length; i++) {
		this.selection[i].deselect();
	}

    this.selection.splice(0, this.selection.length);
}

// Select vertex 'v'.
World.prototype.selectVertex = function(v) {
    v.select();
    this.selection.push(v);
}

// Select edge 'e'.
World.prototype.selectEdge = function(e) {
    e.select();
    this.selection.push(e);
};

// Remove the selected entity, and clean up all its links/edges.
World.prototype.removeSelected = function() {
    // First remove selected edges.
    // (Because removing vertices first may also result in removing selected edges.)
    for (var i = 0; i < this.selection.length; i++) {
        if (this.selection[i] instanceof Edge && this.selection[i].graph instanceof UserGraph) {
            // Remove edge from graph.
            this.selection[i].graph.removeEdge(this.selection[i]);

            // Remove from selection.
            this.selection[i].deselect();
            this.selection.splice(i, 1);
            // Decrement i, because all elements shifted.
            i--;
        }
    }
    // Remove selected vertices.
    for (var i = 0; i < this.selection.length; i++) {
        if (this.selection[i] instanceof Vertex && this.selection[i].graph instanceof UserGraph) {
            // Remove vertex from graph
            this.selection[i].graph.removeVertex(this.selection[i]);

            // Remove from selection.
            this.selection[i].deselect();
            this.selection.splice(i, 1);
            // Decrement i, because all elements shifted.
            i--;
        }
    }
}

World.prototype.moveGravity = function(position) {
    this.gravitySource = position.copy();
};

World.prototype.update = function() {
	var edges = this.getEdges();
	var vertices = this.getVertices();

    for (i = 0; i < edges.length; i++) {
        edges[i].update();
    }
    for (i = 0; i < vertices.length; i++) {
        var v1 = vertices[i];
        for (var j = 0; j < vertices.length; j++) {
            if (j === i) {
                continue;
            }
            // Normal global repulsion
            var v2 = vertices[j];
            var distance = v2.position.dist(v1.position);
            var force = Vec2.sub(v2.position, v1.position).constrain(0, this.repulsionConstant / (distance * distance));
            v2.applyForce(force);

            if (distance < v1.radius + v2.radius) {
                // Additional force to prevent overlapping vertices, which is only active when the vertices touch.
                var touchForce = Vec2.sub(v2.position, v1.position).constrain(0, this.touchRepulsionConstant);
                v2.applyForce(touchForce);
            }
        }

        // Social gravity (simply scaled by number of connections)
        var gravForce = Vec2.sub(this.gravitySource, v1.position).constrain(0, this.gravityConstant * (v1.links.length + 1));
        v1.applyForce(gravForce);

        // Random noise force, for float-like effect
        v1.applyNoiseForce(this.noiseConstant);

        // USE THE FORCE
        v1.update(this.maxStepSize);
    }

    if (this.selection.length == 1 && this.ih.isMousePressed('left')) {
    	for (var i = 0; i < this.selection.length; i++) {
    		var selected = this.selection[i];
    		if (selected.graph instanceof UserGraph && selected instanceof Vertex) {
        		selected.moveTo(this.ih.mouse);
    		}
    	}
    }
};

// Draw all vertices and edges.
World.prototype.draw = function(ctx) {
	var edges = this.getEdges();
	var vertices = this.getVertices();

    for (var i = 0; i < edges.length; i++) {
        edges[i].draw(ctx);
    }

    for (i = 0; i < vertices.length; i++) {
        vertices[i].draw(ctx);
    }
};
