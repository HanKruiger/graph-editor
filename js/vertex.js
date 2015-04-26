function Vertex(_position) {
    this.position = _position.copy();
    this.force = createVector(0, 0);
    this.radius = 12;
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

// Method to update position
Vertex.prototype.update = function(step_size) {
    if (this.force.mag() !== 0) {
        this.position.add(this.force.setMag(step_size));
        this.force = createVector(0, 0);
    }
};

// Method to display
Vertex.prototype.display = function() {
    ellipse(this.position.x, this.position.y, this.radius, this.radius);
};