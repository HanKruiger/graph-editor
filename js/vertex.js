function Vertex(position) {
    this.position = position.copy();
    this.force = createVector(0, 0);
    this.radius = constrain(randomGaussian(24, 12), 16, 32);
    this.links = [];
    this.label = '';

    // Seed for Perlin noise
    this.seed = random(0, 424242);
}

Vertex.prototype.moveTo = function(position) {
    this.position = position.copy();
}

// Apply a force to the vertex
Vertex.prototype.applyForce = function(force) {
    this.force.add(force);
};

// Add another vertex to the list of neighbours
Vertex.prototype.addLink = function(link) {
    this.links.push(link);
};

// Removes 'link' from the list of links.
Vertex.prototype.removeLink = function(link) {
    var index = this.links.indexOf(link);
    if (index >= 0) {
        this.links.splice(index, 1);
    } else {
        console.error("Couldn't remove link from vertex!");
    }
}

// Returns true iff 'v' is a neighbout of this vertex.
Vertex.prototype.hasNeighbour = function(v) {
    for (i = 0; i < this.links.length; i++) {
        if (this.links[i].v1 === v || this.links[i].v2 === v) {
            return true;
        }
    }
    return false;
}

// Traverses to the vertex's neighbours, and removes the links going to this vertex.
Vertex.prototype.remove = function() {
    for (i = 0; i < this.links.length; i++) {
        this.links[i].traverseFrom(this).removeLink(this.links[i]);
    }
}

Vertex.prototype.applyNoiseForce = function(noiseConstant) {
    noiseDetail(5, 0.5);
    this.applyForce(createVector(noise(this.seed) - 0.5, noise(this.seed + 10000) - 0.5).mult(noiseConstant));
    this.seed++;
}

// Method to update position
Vertex.prototype.update = function(maxStepSize) {
    if (this.force.mag() !== 0) {
        this.position.add(this.force.setMag(constrain(this.force.mag(), 0, maxStepSize)));
        this.force.setMag(0);
    }
};

// Method to display
Vertex.prototype.display = function(selected) {
    if (selected) {
        stroke(0);
        fill(255);
        strokeWeight(4);
    } else {
        stroke(0);
        fill(128);
        strokeWeight(2);
    }
    ellipse(this.position.x, this.position.y, 2 * this.radius, 2 * this.radius);

    stroke(0);
    fill(128);
    strokeWeight(1);
    textAlign(CENTER);
    textFont("Courier");
    text(this.label, this.position.x, this.position.y);
};