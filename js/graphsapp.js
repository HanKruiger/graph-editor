function GraphsApp() {
    this.initCanvas();
    this.initGraph();
    this.initInput();
    noise.seed(42);
    var fps = 30;
    var me = this;
    /* Schedule the main loop to be called fps times per second, using the 
     * GraphsApp's this context. */
    setInterval(function() { me.mainLoop.call(me); }, 1000/fps);
}

GraphsApp.prototype.initCanvas = function() {
    var canvas = document.getElementById('the_canvas');
    if (canvas.getContext) {
        this.ctx = canvas.getContext('2d');
        /* For resizing canvas. For reference,
         * see http://stackoverflow.com/a/3078427 */
        this.ctx.canvas.width = 0.8 * window.innerWidth;

        // Prevents right-click context menu.
        $('body').on('contextmenu', '#the_canvas', function(e) {
            return false;
        });
    } else {
        console.error('Canvas not supported by browser.');
    }
};

GraphsApp.prototype.initGraph = function() {
    /* Initialize graph with origin at canvas coordinates in the middle of the
     * canvas. */
    this.graph = new Graph(
        new Vec2(0.5 * this.ctx.canvas.width, 0.5 * this.ctx.canvas.height)
    );
    
    /* Add a vertex at the origin. */
    this.graph.addVertex(new Vec2(0, 0));
};

GraphsApp.prototype.initInput = function() {
    var inputHandler = new InputHandler();
    var canvas = this.ctx.canvas;
    var graph = this.graph;

    $(document).keydown(function(event){
        inputHandler.keyDown(event.which); 
    });
    $(document).keyup(function(event){
        inputHandler.keyUp(event.which); 
    });

    /* Function for correcting coordinates to right coordinate system */
    function correctCoordinates(x, y) {
        /* Correction for scrolling */
        x += document.body.scrollLeft + document.documentElement.scrollLeft;
        y += document.body.scrollTop + document.documentElement.scrollTop;

        /* Correction for canvas position */
        x -= canvas.offsetLeft + 1; /* <-- Weird! */
        y -= canvas.offsetTop;

        /* Correction for graph coordinate system */
        x -= graph.origin.x;
        y -= graph.origin.y;
        return new Vec2(x, y);
    }
    $("#the_canvas").mousedown(function(event) {
        var mousePosition = correctCoordinates(event.clientX, event.clientY);
        inputHandler.mouseDown(event.which, mousePosition);
        return false;
    });
    /* TODO: Test whether this has to change to the entire body/document */
    $("#the_canvas").mouseup(function(event) {
        var mousePosition = correctCoordinates(event.clientX, event.clientY);
        inputHandler.mouseUp(event.which, mousePosition);
    });
    $("#the_canvas").mousemove(function(event) {
        var mousePosition = correctCoordinates(event.clientX, event.clientY);
        inputHandler.mouseMove(mousePosition);
    });

    /* Make the input handler available for this object's scope. */
    this.ih = inputHandler;

    // Pass this object to the graph to initialise some redirects.
    this.graph.initEventRedirects(inputHandler);
};

GraphsApp.prototype.mainLoop = function() {
    this.update();
    this.draw();
};

GraphsApp.prototype.update = function() {
    this.graph.update();
};

GraphsApp.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.graph.draw(this.ctx);
};
