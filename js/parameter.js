// Static counter that increments every time a new object is made.
Parameter.numParams = [0, 0, 0, 0];

Parameter.orientationEnum = {
	NORTH_EAST: 0,
	SOUTH_EAST: 1,
	SOUTH_WEST: 2,
	NORTH_WEST: 3
}

function Parameter(_name, _initial_value, _maxValue, _orientation, _callbackObject, _callbackFunction) {
    this.name = _name;
    this.maxValue = _maxValue;
    this.orientation = _orientation;
    this.index = Parameter.numParams[this.orientation]++;
    this.slider = createSlider(0, 100, _initial_value * 100 / this.maxValue);

    if (this.orientation == Parameter.orientationEnum.NORTH_WEST) {
    	this.slider.position(20, 30 + 50 * this.index);
    	this.textPosition = createVector(10, 20 + 50 * this.index);
    } else if (this.orientation == Parameter.orientationEnum.NORTH_EAST) {
    	this.slider.position(width - 150, 30 + 50 * this.index);
    	this.textPosition = createVector(width - 10, 20 + 50 * this.index);
    } else if (this.orientation == Parameter.orientationEnum.SOUTH_EAST) {
    	this.slider.position(width - 150, height - (30 + 50 * this.index));
    	this.textPosition = createVector(width - 10, height - (40 + 50 * this.index));
    } else if (this.orientation == Parameter.orientationEnum.SOUTH_WEST) {
    	this.slider.position(20, height - (30 + 50 * this.index));
    	this.textPosition = createVector(10, height - (40 + 50 * this.index));
    } else {
    	console.error("'orientation' must be one of the values defined in Parameter.orientationEnum.");
    }

    var me = this;
    this.slider.elt.oninput = function() {
        _callbackFunction.call(_callbackObject, me.value());
    };
}

// Retrieve the value of the parameter
Parameter.prototype.value = function() {
    return this.slider.value() * this.maxValue / 100.0;
};

// Display the parameter name and value next to the slider
Parameter.prototype.display = function() {
	if (this.orientation == Parameter.orientationEnum.NORTH_WEST || this.orientation == Parameter.orientationEnum.SOUTH_WEST) {
		textAlign(LEFT);
	} else {
		textAlign(RIGHT);
	}
    text(this.name + ": " + this.value(), this.textPosition.x, this.textPosition.y);
};

Parameter.prototype.remove = function() {
	Parameter.numParams[this.orientation]--;
	this.name = "If you see this, something went terribly wrong.";
}
