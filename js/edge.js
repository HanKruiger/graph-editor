Edge.prototype.naturalSpringLength = 70;
Edge.prototype.weight = 1;
Edge.prototype.springConstant = 0.05;

function Edge(v1, v2, weight) {
    this.v1 = v1;
    this.v2 = v2;
}

// Update the vertices that this edge connects.
Edge.prototype.update = function() {
    var p1 = this.v1.position;
    var p2 = this.v2.position;

    // Negative when contracted, positive when extended
    var extension = p5.Vector.dist(p1, p2) - this.naturalSpringLength;
    var force = p5.Vector.sub(p2, p1).setMag(extension * this.springConstant);

    this.v1.applyForce(force);
    this.v2.applyForce(force.mult(-1));
};

// Draw a line to display the edge
Edge.prototype.display = function() {
    line(this.v1.position.x, this.v1.position.y, this.v2.position.x, this.v2.position.y);
};

Edge.prototype.distanceTo = function(p) {
    var p1 = this.v1.position, p2 = this.v2.position;
    var length = p5.Vector.dist(p1, p2);

    // If the edge has no length. (To prevent the end of the universe)
    if (length == 0) return p5.Vector.dist(p1, p);
    
    // The point p is projected onto the line segment.
    // lambda is the parameter in the expression of the line segment:
    // (1 - lambda) * p1 + lambda * p2
    var lambda = p5.Vector.dot(p5.Vector.sub(p, p1), p5.Vector.sub(p2, p1)) / (length * length);

    // Point is closest to p1
    if (lambda < 0) return p5.Vector.dist(p, p1);
    // Point is closest to p2
    if (lambda > 1) return p5.Vector.dist(p, p2);

    // Point is closest to somewhere in the middle of the line segment.
    return p5.Vector.dist(p, p5.Vector.mult(p1, 1 - lambda).add(p5.Vector.mult(p2, lambda)));
}
