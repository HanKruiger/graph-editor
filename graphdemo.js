var sketch = function(p) {
    var graph;

    p.setup = function() {
        p.createCanvas(1280, 720);
        graph = new Graph(p.createVector(p.width / 2, p.height / 2));
        graph.addVertex();
        // graph.addRandomVertexWithEdge();
        // console.log(p.createVector(0, 0).mag());
        // var v2 = graph.addVertex();
        // graph.addEdge(v1, v2);
    }

    p.draw = function() {
        p.background(200);
        if (p.mouseIsPressed) {
            graph.addRandomVertexWithEdge();
        }
        graph.update();
    }

    // A simple Vertex class
    function Vertex(position) {
        this.position = position.copy();
        this.force = p.createVector(0, 0);
        this.neighbours = [];
    }

    Vertex.prototype.applyForce = function(force) {
        this.force.add(force);
    }

    // Add another vertex to the list of neighbours
    Vertex.prototype.addLink = function(neighbour) {
        this.neighbours.push(neighbour);
    };

    // Method to update position
    Vertex.prototype.update = function() {
        if (this.force.mag != 0) {
            this.position.add(this.force.normalize());
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
        this.naturalLength = weight; // for now.
        this.k = 5;
    }

    // Update the vertices that this edge connects.
    Edge.prototype.update = function() {
        // do nothing for now.
        var p1 = this.v1.position;
        var p2 = this.v2.position;
        var distance = p5.Vector.dist(p1, p2);
        var force = p5.Vector.sub(p2, p1).mult(this.k);

        this.v1.applyForce(force);
        this.v2.applyForce(force.mult(-1));
    };

    Edge.prototype.display = function() {
        p.line(this.v1.position.x, this.v1.position.y, this.v2.position.x, this.v2.position.y);
    };

    // Graph class
    function Graph(position) {
        this.origin = position.copy();
        this.vertices = [];
        this.edges = [];
    }

    Graph.prototype.addVertex = function() {
        var vertex = new Vertex(p.createVector(p.random(p.width), p.random(p.height)));
        this.vertices.push(vertex);
        return vertex;
    };

    Graph.prototype.addEdge = function(v1, v2) {
        this.edges.push(new Edge(v1, v2));
    };

    Graph.prototype.getRandomVertex = function() {
        var i = p.int(p.random(this.vertices.length - 1));
        return this.vertices[i];
    };

    Graph.prototype.addRandomVertexWithEdge = function() {
        var v1 = this.getRandomVertex();
        var v2 = this.addVertex();
        this.edges.push(new Edge(v1, v2));
        console.log(v1);
        // Add links to respective vertices.
        v1.addLink(v2);
        v2.addLink(v1);

        return v2;
    };

    Graph.prototype.update = function() {
        // this.origin = p.createVector(p.mouseX, p.mouseY); <-- Could be interesting.
        for (var i = 0; i < this.edges.length; i++) {
            var edge = this.edges[i];
            edge.update();
            edge.display();
        }
        for (var i = 0; i < this.vertices.length; i++) {
            var vertex = this.vertices[i];
            vertex.update();
            vertex.display();
        }
    };

};

// Make a p5 object that draws all the stuff.
// This keeps all p5 objects out of the global scope.
var myp5 = new p5(sketch);
