/**
 * Creates an instance of a two-dimensional vector, Vec2.
 * 
 * @constructor
 * @param {number} x The x-coordinate of the vector.
 * @param {number} y The y-coordinate of the vector.
 */
function Vec2(x, y) {
    this.x = x;
    this.y = y;
}

/**
 * Copies this vector to a new object.
 *
 * @return {Vec2} A copy of this object.
 */
Vec2.prototype.copy = function() {
    return new Vec2(this.x, this.y);
};

/**
 * Returns the magnitude of this vector.
 * 
 * @return {number} The magnitude of this vector.
 */
Vec2.prototype.mag = function() {
    return Math.sqrt(this.magSq());
};

/**
 * Returns the squared magnitude of this vector. This is a lot faster than the
 * non-squared magnitude and is therefore preferred whenever possible.
 * 
 * @return {number} The squared magnitude of this vector.
 */
Vec2.prototype.magSq = function() {
    return this.x * this.x + this.y * this.y;
};

/**
 * Returns the dot product of this vector with another vector.
 * 
 * @param {Vec2} v  The vector to take the dot product with.
 * @return {number} The dot product.
 */
Vec2.prototype.dot = function(v) {
    return this.x * v.x + this.y * v.y;
};

/**
 * Returns the two-dimensional analogue of the cross product with another
 * vector. It is equivalent to taking the cross product of the two vectors with
 * the z-coordinates set to 0.
 * 
 * @param {Vec2} v  The vector to take the cross product with.
 * @return {number} The magnitude of the cross product in the z-direction.
 */
Vec2.prototype.cross = function(v) {
    return this.x * v.y - this.y * v.x;
};

/**
 * Inverses this vector.
 *
 * @return {Vec2} This vector.
 */
Vec2.prototype.inv = function() {
    return this.mult(-1);
};

/**
 * Multiplies this vector by a factor.
 * 
 * @param {number} factor   The factor to multiply this vector with.
 * @return {Vec2}           This vector.
 */
Vec2.prototype.mult = function(factor) {
    this.x *= factor;
    this.y *= factor;
    return this;
};

/**
 * Sets the magnitude of this vector. If this vector currently has a magnitude
 * equal to 0, this function sets the x-coordinate of this vector to mag.
 * 
 * @param {number} mag  The magnitude that this vector will have afterwards.
 * @return {Vec2}       This vector.
 */
Vec2.prototype.setMag = function(mag) {
    if (this.mag() == 0) {
        console.warn('Setting vector to Vec2(mag, 0), because otherwise' +
            'division by zero.');
        this.x = mag;
        this.y = 0;
        return this;
    }
    return this.mult(mag / this.mag());
};

/**
 * Constrains the magnitude of this vector. If this vector currently has a
 * magnitude smaller than min, it will be set to min. If this vector has a
 * magnitude larger than max, it will be set to max. Otherwise, the vector
 * doesn't change and will be returned as is.
 * 
 * @param {number} min  The minimal magnitude that this vector will 
 *                      have after this function call.
 * @param {number} max  The maximal magnitude that this vector will 
 *                      have after this function call.
 * @return {Vec2}       This vector.
 */
Vec2.prototype.constrain = function(min, max) {
    if (min != 0 && this.mag() == 0) {
        console.warn('Setting vector to Vec2(min, 0), because otherwise' +
            'division by zero.');
        this.x = min;
        this.y = 0;
        return this;
    } else if (this.mag() < min) {
        return this.setMag(min);
    } else if (this.mag() > max) {
        return this.setMag(max);
    }
    return this;
};

/**
 * Adds a vector to this vector.
 * 
 * @param {Vec2} v  The vector to add to this vector.
 * @return {Vec2}   This vector.
 */
Vec2.prototype.add = function(v) {
    this.x += v.x
    this.y += v.y;
    return this;
};

/**
 * Subtracts a vector from this vector.
 * 
 * @param {Vec2} v  The vector to subtract from this vector.
 * @return {Vec2}   This vector.
 */
Vec2.prototype.sub = function(v) {
    return this.add(v.copy().inv());
};

/**
 * Returns the Euclidian distance from this vector to another vector. This is a
 * lot faster than the non-squared magnitude and is therefore preferred whenever
 * possible.
 *
 * @param {Vec2} v  The vector to which the distance is needed.
 * @return {number} The distance from this vector to the other vector.
 */
Vec2.prototype.dist = function(v) {
    return Math.sqrt(this.distSq(v));
};

/**
 * Returns the squared Euclidian distance from this vector to another vector.
 *
 * @param {Vec2} v  The vector to which the squared distance is needed.
 * @return {number} The squared Euclidian distance from this vector to the other
 *                  vector.
 */
Vec2.prototype.distSq = function(v) {
    return (this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y);
};

/*========================================
=            Static functions            =
========================================*/

/**
 * Static equivalent of the add function.
 * 
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2} The sum of the two vectors
 */
Vec2.add = function(v1, v2) {
    return v1.copy().add(v2);
};

/**
 * Static equivalent of the sub function.
 * 
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2} The difference of the two vectors
 */
Vec2.sub = function(v1, v2) {
    return v1.copy().sub(v2);
};

/**
 * Static equivalent of the mult function.
 * 
 * @param {Vec2} v
 * @param {number} f
 * @return {Vec2} The vector multiplied with a factor.
 */
Vec2.mult = function(v, f) {
    return v.copy().mult(f);
};

/**
 * Static equivalent of the setMag function.
 * 
 * @param {Vec2} v
 * @param {number} mag
 * @return {Vec2} The vector with the provided magnitude.
 */
Vec2.setMag = function(v, mag) {
    return v.copy().setMag(mag);
};

/**
 * Static equivalent of the constrain function.
 * 
 * @param {Vec2} v
 * @param {number} min
 * @param {number} max
 * @return {number} Copy of v, contrained between min and max.
 */
Vec2.constrain = function(v, min, max) {
    return v.copy().constrain(min, max);
};

/**
 * Static equivalent of the dot function.
 * 
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {number} The dot product of v1 and v2.
 */
Vec2.dot = function(v1, v2) {
    return v1.dot(v2);
};

/**
 * Static equivalent of the cross function.
 * 
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {number} The cross product of v1 and v2.
 */
Vec2.cross = function(v1, v2) {
    return v1.cross(v2);
};

/**
 * Static equivalent of the dist function.
 * 
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {number} The distance between v1 and v2.
 */
Vec2.dist = function(v1, v2) {
    return v1.dist(v2);
};

/**
 * Static equivalent of the distSq function.
 * 
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {number} The squared distance between v1 and v2.
 */
Vec2.distSq = function(v1, v2) {
    return v1.distSq(v2);
};