function Graph(world) {
    this.world = world;
    this.vertices = [];
    this.edges = [];
}

Graph.prototype.initEventRedirects = function(ih) {
    ih.registerClickRedirect("left", [86/*V*/], [], this.addVertex, this);
};

// Add a vertex to the graph with initial position 'position'.
Graph.prototype.addVertex = function(position) {
    var v = new Vertex(position, this);

    this.vertices.push(v);
    // this.world.addVertex(v);

    return v;
};

// Add an edge between the two given vertices.
Graph.prototype.addEdge = function(v1, v2) {
    var e = new Edge(v1, v2, this);
    v1.addLink(e);
    v2.addLink(e);

    this.edges.push(e);
    // this.world.addEdge(e);

    return e;
};

Graph.prototype.removeEdge = function(e) {
    // Remove links to the edge from the connected vertices.
    e.v1.removeLink(e);
    e.v2.removeLink(e);

    // Remove edge from edges array.
    var i = this.edges.indexOf(e);
    if (i >= 0) {
        this.edges.splice(i, 1);
    } else {
        console.warn('Coudldn\'t find edge!');
    }
}

Graph.prototype.removeVertex = function(v) {
    // Copy links array (because we're manipulating it).
    var linksCopy = v.links.slice(0);

    // Remove edges connected to 'v'.
    for (var i = 0; i < linksCopy.length; i++) {
        this.removeEdge(linksCopy[i]);
    }

    // Remove vertex from vertices array.
    i = this.vertices.indexOf(v);
    if (i >= 0) {
        this.vertices.splice(i, 1);
    } else {
        console.warn('Coudldn\'t find vertex!');
    }
};
