function Vertex(position) {
    this.position = position.copy();
    this.force = createVector(0, 0);
    this.radius = constrain(randomGaussian(24, 12), 16, 32);
    this.neighbours = [];
}

Vertex.prototype.moveTo = function(position) {
    this.position = position.copy();
}

// Apply a force to the vertex
Vertex.prototype.applyForce = function(force) {
    this.force.add(force);
};

// Add another vertex to the list of neighbours
Vertex.prototype.addLink = function(neighbour) {
    this.neighbours.push(neighbour);
};

Vertex.prototype.hasNeighbour = function(v) {
    for (i = 0; i < this.neighbours.length; i++) {
        if (this.neighbours[i] === v) {
            return true;
        }
    }
    return false;
}

// Method to update position
Vertex.prototype.update = function(maxStepSize) {
    if (this.force.mag() !== 0) {
        this.position.add(this.force.setMag(constrain(this.force.mag(), 0, maxStepSize)));
        this.force = createVector(0, 0);
    }
};

// Method to display
Vertex.prototype.display = function() {
    ellipse(this.position.x, this.position.y, 2 * this.radius, 2 * this.radius);
};