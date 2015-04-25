function Vertex(_position) {
    this.position = _position.copy();
    this.force = createVector(0, 0);
    this.neighbours = [];
}

// Apply a force to the vertex
Vertex.prototype.applyForce = function(force) {
    this.force.add(force);
};

// Add another vertex to the list of neighbours
Vertex.prototype.addLink = function(neighbour) {
    this.neighbours.push(neighbour);
};

// Method to update position
Vertex.prototype.update = function(step_size) {
    if (this.force.mag() !== 0) {
        this.position.add(this.force.setMag(step_size));
        this.force = createVector(0, 0);
    }
};

// Method to display
Vertex.prototype.display = function() {
    stroke(0);
    strokeWeight(2);
    fill(128);
    ellipse(this.position.x, this.position.y, 12, 12);
};