function InputHandler() {
    this.pressedKeys = [];
    this.mouseButtons = {
        left: 0,
        right: 0,
        middle: 0
    };
    this.mouse = new Vec2(0, 0);

    this.clickRedirects = [];
    this.keyDownRedirects = [];
}

/**
 * Registers a redirect triggered by a mouse click.
 * 
 * @param {String} button           String indicating the mouse button that
 *                                  triggers the event. ('left', 'right' or
 *                                  'middle')
 * @param {array}  keys             Array of keycodes that must be pressed for
 *                                  the redirect to be triggered.
 * @param {array}  buttons          Array of mouse buttons that must be pressed
 *                                  for the redirect to be triggered.
 * @param {function} callbackFunc   Function to call when the redirect is
 *                                  triggered.
 * @param {Object} callbackObj      Context for where to call callbackFunc
 */
InputHandler.prototype.registerClickRedirect = function(button, keys, buttons,
        callbackFunc, thisObj) {
    this.clickRedirects.push({
        button: button,
        keys: keys, 
        buttons: buttons, 
        callbackFunc: callbackFunc,
        thisObj: thisObj
    });
};

/**
 * Registers a redirect triggered by a keydown event.
 * 
 * @param {number} code             Key code
 * @param {array}  keys             Array of keycodes that must be pressed for
 *                                  the redirect to be triggered.
 * @param {array}  buttons          Array of mouse buttons that must be pressed
 *                                  for the redirect to be triggered.
 * @param {function} callbackFunc   Function to call when the redirect is
 *                                  triggered.
 * @param {Object} callbackObj      Context for where to call callbackFunc
 */
InputHandler.prototype.registerKeyDownRedirect = function(code, keys, buttons,
        callbackFunc, thisObj) {
    this.keyDownRedirects.push({
        code: code,
        keys: keys, 
        buttons: buttons, 
        callbackFunc: callbackFunc,
        thisObj: thisObj
    });
};

InputHandler.prototype.keyDown = function(code) {
    if (this.pressedKeys.indexOf(code) == -1) {
        this.pressedKeys.push(code);
    }

    /* Loop through the keyDownRedirects array to check whether we have to
     * trigger a redirect now. There might be multiple. We store them in
     * `redirs` */
    var redirs = []
    this.keyDownRedirects.forEach(function(redir) {
        if(redir.code == code &&
                redir.keys.every(this.isKeyPressed, this) &&
                redir.buttons.every(this.isMousePressed, this)) {
            /* If all the required keys are pressed, and the right trigger
             * trigger button is pressed, add it to the redirs! */
            redirs.push(redir);
        }
    }, this);

    /* Pick the redirect with the largest key combination */
    var redir = redirs[0];
    for (var i = 1 ; i < redirs.length; i++) {
        if (redirs[i].keys.length > redir.keys.length) {
            redir = redirs[i];
        }
    }

    /* Call the callback function, if any. */
    if (redir) {
        redir.callbackFunc.call(redir.thisObj, this.mouse.copy());
    }
};

InputHandler.prototype.keyUp = function(code) {
    var index = this.pressedKeys.indexOf(code);
    if (index == -1) {
        console.warn('Got a keyUp event for a key that wasn\'t pressed!\n' +
            'This is normal as long as it happens when switching windows or ' +
            'reloading.');
    }
    this.pressedKeys.splice(index, 1);
};

InputHandler.prototype.mouseDown = function(code, position) {
    var buttonString;
    switch(code) {
        case 1:
            /* Left */
            buttonString = "left";
            this.mouseButtons.left = 1;
            break;
        case 2:
            /* Middle */
            buttonString = "middle";
            this.mouseButtons.middle = 1;
            break;
        case 3:
            /* Right */
            buttonString = "right";
            this.mouseButtons.right = 1;
            break;
        default:
            console.error("Unidentified mouse event!");
    }
    /* Loop through the clickRedirects array to check whether we have to trigger
     * a redirect now. There might be multiple. We store them in `redirs` */
    var redirs = []
    this.clickRedirects.forEach(function(redir) {
        if(redir.button == buttonString &&
                redir.keys.every(this.isKeyPressed, this) &&
                redir.buttons.every(this.isMousePressed, this)) {
            /* If all the required keys are pressed, and the right trigger
             * trigger button is pressed, add it to the redirs! */
            redirs.push(redir);
        }
    }, this);

    /* Pick the redirect with the largest key combination */
    var redir = redirs[0];
    for (var i = 1 ; i < redirs.length; i++) {
        if (redirs[i].keys.length > redir.keys.length) {
            redir = redirs[i];
        }
    }

    /* Call the callback function, if any. */
    if (redir) {
        redir.callbackFunc.call(redir.thisObj, position);
    }
};

InputHandler.prototype.mouseUp = function(code) {
    switch(code) {
        case 1:
            /* Left */
            this.mouseButtons.left = 0;
            break;
        case 2:
            /* Middle */
            this.mouseButtons.middle = 0;
            break;
        case 3:
            /* Right */
            this.mouseButtons.right = 0;
            break;
        default:
            console.error("Unidentified mouse event!");
    }
};

InputHandler.prototype.mouseMove = function(position) {
    this.mouse = position;
};

InputHandler.prototype.isMousePressed = function(mouseButton) {
    switch(mouseButton) {
        case "middle":
            return this.mouseButtons.middle;
        case "right":
            return this.mouseButtons.right;
        case "left":
            return this.mouseButtons.left;
        default:
            return 0;
    }
};

InputHandler.prototype.isKeyPressed = function(code) {
    return this.pressedKeys.indexOf(code) != -1;
};