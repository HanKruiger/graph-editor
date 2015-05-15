Edge.prototype.naturalSpringLength = 70;
Edge.prototype.springConstant = 0.05;

function Edge(v1, v2) {
    this.v1 = v1;
    this.v2 = v2;
}

// Returns the vertex that is opposite from v.
Edge.prototype.traverseFrom = function(v) {
    if (v === this.v1) return this.v2;
    if (v === this.v2) return this.v1;
    console.error("Could not traverse!");
}

// Removes links to this edge from both vertices.
Edge.prototype.remove = function() {
    this.v1.removeLink(this);
    this.v2.removeLink(this);
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
Edge.prototype.display = function(selected) {
    if (selected) {
        stroke(0);
        fill(255);
        strokeWeight(2);
        push();
        // Translate to v1
        translate(this.v1.position.x, this.v1.position.y);
        // Rotate such that v2 is on the positive y-axis (below)
        rotate(this.orientation());
        rect(-2, 0, 4, this.length());
        pop();
    } else {
        stroke(0);
        strokeWeight(2);
        line(this.v1.position.x, this.v1.position.y, this.v2.position.x, this.v2.position.y);
    }
};

// Returns the length of the line segment from v1 to v2.
Edge.prototype.length = function() {
    return p5.Vector.dist(this.v1.position, this.v2.position)
}

// Returns the distance from the line segment from v1 to v2, to the point p.
Edge.prototype.distanceTo = function(p) {
    var p1 = this.v1.position, p2 = this.v2.position;
    var length = this.length();

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

/* Returns angle (in radians, clockwise) between the vector from v1 to v2 and the positive y-axis */
Edge.prototype.orientation = function() {
    var yAxis = createVector(0, 1);
    var edgeVec = p5.Vector.sub(this.v2.position, this.v1.position);
    var dot = p5.Vector.dot(yAxis, edgeVec);
    var det = yAxis.x * edgeVec.y - yAxis.y * edgeVec.x;
    return atan2(det, dot)
}