Edge.prototype.naturalSpringLength = 70;
Edge.prototype.springConstant = 0.05;

function Edge(v1, v2, graph) {
    this.v1 = v1;
    this.v2 = v2;
    this.graph = graph;
    this.selected = false;
}

// Returns the vertex that is opposite from v.
Edge.prototype.traverseFrom = function(v) {
    if (v === this.v1) return this.v2;
    if (v === this.v2) return this.v1;
    console.error("Could not traverse!");
};

// Update the vertices that this edge connects.
Edge.prototype.update = function() {
    var p1 = this.v1.position;
    var p2 = this.v2.position;

    // Negative when contracted, positive when extended
    var extension = p1.dist(p2) - this.naturalSpringLength;
    var force = Vec2.sub(p2, p1).setMag(extension * this.springConstant);

    this.v1.applyForce(force);
    this.v2.applyForce(force.mult(-1));
};

Edge.prototype.select = function() {
    this.selected = true;
    this.naturalSpringLengthSlider = new Slider(
        "Natural spring length", this.naturalSpringLength, 0, 150, 'right', this, function(naturalSpringLength) {
            this.naturalSpringLength = naturalSpringLength;
        }
    );
    this.springConstantSlider = new Slider(
        "Spring constant", this.springConstant, 0, 2, 'right', this, function(springConstant) {
            this.springConstant = springConstant;
        }
    );
};

Edge.prototype.deselect = function() {
    this.selected = false;
    this.naturalSpringLengthSlider.remove();
    this.springConstantSlider.remove();
};

// Draw a line to display the edge
Edge.prototype.draw = function(ctx) {
    if (this.selected) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgb(255, 186, 66)";
    } else {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(10, 10, 10)";
    }
    ctx.beginPath();
    ctx.moveTo(this.v1.position.x, this.v1.position.y);
    ctx.lineTo(this.v2.position.x, this.v2.position.y);
    ctx.stroke();
    this.orientation();
};

// Returns the length of the line segment from v1 to v2.
Edge.prototype.length = function() {
    return this.v1.position.dist(this.v2.position);
};

// Returns the distance from the line segment from v1 to v2, to the point p.
Edge.prototype.distanceTo = function(p) {
    var p1 = this.v1.position, p2 = this.v2.position;
    var length = this.length();

    // If the edge has no length. (To prevent the end of the universe)
    if (length == 0) return p1.dist(p);
    
    // The point p is projected onto the line segment.
    // lambda is the parameter in the expression of the line segment:
    // (1 - lambda) * p1 + lambda * p2
    var lambda = Vec2.dot(Vec2.sub(p, p1), Vec2.sub(p2, p1)) / (length * length);

    // Point is closest to p1
    if (lambda < 0) return p.dist(p1);
    // Point is closest to p2
    if (lambda > 1) return p.dist(p2);

    // Point is closest to somewhere in the middle of the line segment.
    return p.dist(Vec2.mult(p1, 1 - lambda).add(Vec2.mult(p2, lambda)));
};

/* Returns angle (in radians, clockwise) between the vector from v1 to v2 and the positive y-axis */
Edge.prototype.orientation = function() {
    var yAxis   = new Vec2(0, 1);
    var edgeVec = Vec2.sub(this.v2.position, this.v1.position);
    var cross   = Vec2.cross(yAxis, edgeVec);
    var dot     = Vec2.dot(yAxis, edgeVec);
    return Math.atan2(cross, dot);
};