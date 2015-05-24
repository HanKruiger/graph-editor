function GraphsApp() {
    this.initCanvas();
    this.initWorld();

    // Initialise camera to be centered on the world's origin
    this.camera = new Vec2(0.5 * this.ctx.canvas.width, 0.5 * this.ctx.canvas.height);

    this.initInput();
    
    // Set seed for perlin.js
    noise.seed(42);

    var fps = 60;
    var me = this;
    /* Schedule the main loop to be called fps times per second, using the 
     * GraphsApp's this context. */
    setInterval(function() { me.mainLoop.call(me); }, 1000 / fps);
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

GraphsApp.prototype.initWorld = function() {
    /* Initialize graph with origin at canvas coordinates in the middle of the
     * canvas. */
    this.world = new World();
};

GraphsApp.prototype.initInput = function() {
    var inputHandler = new InputHandler();
    var canvas = this.ctx.canvas;
    var camera = this.camera;

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

        /* Correction for world's coordinate system */
        x -= camera.x;
        y -= camera.y;
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
    this.world.initEventRedirects(inputHandler);
};

GraphsApp.prototype.mainLoop = function() {
    this.update();
    this.draw();
};

GraphsApp.prototype.update = function() {
    this.world.update();
};

GraphsApp.prototype.draw = function() {
    // Save the canvas
    this.ctx.save();

    // Clear canvas
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Translate to the center of the canvas.
    this.ctx.translate(this.camera.x, this.camera.y);

    // Draw the world
    this.world.draw(this.ctx);
    
    // Restore the canvas
    this.ctx.restore();
};
