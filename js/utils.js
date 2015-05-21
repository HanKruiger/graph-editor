function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

function clamp(val, min, max) {
	if (val < min)
		return min;
	if (val > max)
		return max;
	return val;
}

function gaussian(mean, stddev) {
	/* From: http://stackoverflow.com/a/20161247 */
	rnd = ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
	if (stddev !== undefined)
		rnd *= stddev;
	if (mean !== undefined)
		rnd += mean;
	return rnd;
}