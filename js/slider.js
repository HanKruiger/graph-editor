/**
 * Creates a Slider object and adds it to the DOM.
 *
 * @constructor
 * @param {String}   name         The name of the parameter that this slider
 *                                edits
 * @param {number}   initialValue Initial value of the parameter.
 * @param {number}   minValue     Minimum value of the parameter.
 * @param {number}   maxValue     Maximum value of the parameter.
 * @param {String}   orientation  String indicating the orientation. Must be
 *                                either 'left' or 'right' at this moment.
 * @param {Object}   thisObj      The 'this' context of the callback function.
 * @param {Function} callback     The callback function that is called when the
 *                                slide receives input.
 */
function Slider(name, initialValue, minValue, maxValue, orientation, thisObj, callback) {
    this.name = name;
    this.maxValue = maxValue;
    this.minValue = minValue;
    this.steps = 100;
    this.precision = 2;

    // Create the container in which the text and slider will be placed.
    this.container = $(document.createElement('div'))
        .addClass('parameter');

    // Place the container in the proper parameter container.
    if (orientation === 'left') {
        this.container.appendTo('#parameters_left');
    } else if (orientation === 'right') {
        this.container.appendTo('#parameters_right');
    } else {
        console.error("'orientation' must be either 'left' or 'right'.");
    }

    // Create the text element and add it to the container.
    this.text = $(document.createElement('p'))
        .text(name + ': ' + initialValue.toFixed(this.precision))
        .appendTo(this.container);

    var me = this;
    // Create the slider element and add it to the container.
    this.slider = $(document.createElement('input'))
        .addClass('slider')
        .attr('type', 'range')
        .attr('min', 0)
        .attr('max', this.steps)
        // Value in slider range
        .val(this.steps * (initialValue - minValue) / (maxValue - minValue))
        .appendTo(this.container)
        // Define the function that is to be called when the slider receives input.
        .on('input', function() {
            callback.call(thisObj, me.value());
            me.text.text(name + ': ' + me.value().toFixed(me.precision));
        });
}

/**
 * Returns the value of the slider.
 * 
 * @return {number} Value of the slider
 */
Slider.prototype.value = function() {
    return this.minValue + this.slider.val() * (this.maxValue - this.minValue) / this.steps;
};

/**
 * Removes the slider's container and all child elements.
 * 
 * @return {jQuery} The removed jQuery object. 
 */
Slider.prototype.remove = function() {
    return this.container.remove();
};
