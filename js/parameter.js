function Parameter(_name, _initial_value, _maxValue) {
    this.name = _name;
    this.maxValue = _maxValue;
    this.index = Parameter.numParams++;
    this.slider = createSlider(0, 100, _initial_value * 100 / this.maxValue);
    this.slider.position(20, 20 + 30 * this.index);
}

Parameter.numParams = 0;

Parameter.prototype.value = function() {
    return this.slider.value() * this.maxValue / 100.0;
};

Parameter.prototype.display = function() {
    text(this.name + ": " + this.value(), 165, 35 + 30 * this.index);
};
