function Edge(v1, v2, weight) {
    this.v1 = v1;
    this.v2 = v2;
    this.weight = weight;
}

// Update the vertices that this edge connects.
Edge.prototype.update = function(springLength, springConstant) {
    var p1 = this.v1.position;
    var p2 = this.v2.position;

    // Negative when contracted, positive when extended
    var extension = p5.Vector.dist(p1, p2) - springLength;
    var force = p5.Vector.sub(p2, p1).setMag(extension * springConstant);

    this.v1.applyForce(force);
    this.v2.applyForce(force.mult(-1));
};

// Draw a line to display the edge
Edge.prototype.display = function() {
    line(this.v1.position.x, this.v1.position.y, this.v2.position.x, this.v2.position.y);
};