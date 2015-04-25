function Edge(_v1, _v2, _weight) {
    this.v1 = _v1;
    this.v2 = _v2;
    this.weight = _weight;
}

// Update the vertices that this edge connects.
Edge.prototype.update = function(spring_length, spring_constant) {
    var p1 = this.v1.position;
    var p2 = this.v2.position;

    // Negative when contracted, positive when extended
    var extension = p5.Vector.dist(p1, p2) - spring_length;
    var force = p5.Vector.sub(p2, p1).setMag(extension * spring_constant);

    this.v1.applyForce(force);
    this.v2.applyForce(force.mult(-1));
};

// Draw a line to display the edge
Edge.prototype.display = function() {
    line(this.v1.position.x, this.v1.position.y, this.v2.position.x, this.v2.position.y);
};