function UserGraph(world) {
	// Call Graph's constructor
	Graph.call(this, world);
}

// Inherit from Graph.prototype.
UserGraph.prototype = Object.create(Graph.prototype);

// Only for user graph.
UserGraph.prototype.initEventRedirects = function(ih) {
    ih.registerClickRedirect("left", [86/*V*/], [], this.addVertex, this);
};