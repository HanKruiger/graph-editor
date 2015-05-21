function Vertex(position) {
    this.position = position.copy();
    this.force = new Vec2(0, 0);
    this.radius = clamp(gaussian(24, 12), 16, 32);
    this.links = [];
    this.label = '';
    this.selected = false;

    // Seed for where the Perlin noise starts for this vertex
    this.tNoise = 424242 * Math.random();
}

Vertex.prototype.moveTo = function(position) {
    this.position = position.copy();
};

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
};

// Returns true iff 'v' is a neighbout of this vertex.
Vertex.prototype.hasNeighbour = function(v) {
    for (i = 0; i < this.links.length; i++) {
        if (this.links[i].v1 === v || this.links[i].v2 === v) {
            return true;
        }
    }
    return false;
};

// Traverses to the vertex's neighbours, and removes the links going to this vertex.
Vertex.prototype.remove = function() {
    for (i = 0; i < this.links.length; i++) {
        this.links[i].traverseFrom(this).removeLink(this.links[i]);
    }
};

Vertex.prototype.applyNoiseForce = function(noiseConstant) {
    var noise1 = noise.perlin2(0, this.tNoise);
    var noise2 = noise.perlin2(this.tNoise, 0);
    this.applyForce(new Vec2(noise1, noise2).mult(noiseConstant));
    this.tNoise += 0.05;
};

// Method to update position
Vertex.prototype.update = function(maxStepSize) {
    if (this.force.mag() !== 0) {
        this.position.add(this.force.constrain(0, maxStepSize));
        this.force.setMag(0);
    }
};

Vertex.prototype.select = function() {
    this.selected = true;
};

Vertex.prototype.deselect = function() {
    this.selected = false;
};

Vertex.prototype.draw = function(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    if (this.selected) {
        ctx.lineWidth = 4;
        ctx.fillStyle = "rgb(255, 186, 66)";
    } else {
        ctx.lineWidth = 2;
        ctx.fillStyle = "rgb(200, 200, 200)";
    }
    ctx.strokeStyle = "rgb(10, 10, 10)";
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI*2, true);
    
    ctx.fill();
    ctx.stroke();
    
    // TODO: Display label
    
    ctx.restore();
};