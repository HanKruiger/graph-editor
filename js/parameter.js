function Parameter(name, initialValue, maxValue, orientation, callbackObject, callbackFunction) {
    this.name = name;
    this.maxValue = maxValue;

    // Create the container in which the text and slider will be placed.
    this.container = createDiv('').class('parameter');

    // Place the container in the right parameter container.
    if (orientation === 'left') {
        this.container.parent('parameters_left');
    } else if (orientation === 'right') {
        this.container.parent('parameters_right');
    } else {
        console.error("'orientation' must be one of the values defined in Parameter.orientationEnum.");
    }

    // Create the text element and add it to the container.
    this.text = createP(name + ': ' + initialValue.toFixed(2)).parent(this.container);

    // Create the slider element and add it to the container.
    this.slider = createSlider(0, 100, initialValue * 100 / this.maxValue).parent(this.container);

    // Define the function that is to be called when the slider receives input.
    var me = this;
    this.slider.elt.oninput = function() {
        console.log('value now: ' + me.value());
        callbackFunction.call(callbackObject, me.value());
        me.text.html(name + ': ' + me.value().toFixed(2));
    };
}

// Retrieve the value of the parameter
Parameter.prototype.value = function() {
    return this.slider.value() * this.maxValue / 100.0;
};

// Removes the parameter's container and all child elements.
Parameter.prototype.remove = function() {
    this.container.remove();
};
