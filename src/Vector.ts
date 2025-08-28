export class MyVector {
  _x: number = 0;
  _y: number = 0;
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Calculate the addition of the current vector with the given vector.
   * @memberof Vector
   * @function add
   *
   * @param {Vector|{x: number, y: number}} vector - Vector to add to the current Vector.
   *
   * @returns {Vector} A new Vector instance whose value is the addition of the two vectors.
   */
  add(vec: MyVector) {
    return new MyVector(this.x + vec.x, this.y + vec.y);
  }

  // @ifdef VECTOR_SUBTRACT
  /**
   * Calculate the subtraction of the current vector with the given vector.
   * @memberof Vector
   * @function subtract
   *
   * @param {Vector|{x: number, y: number}} vector - Vector to subtract from the current Vector.
   *
   * @returns {Vector} A new Vector instance whose value is the subtraction of the two vectors.
   */
  subtract(vec: MyVector) {
    return new MyVector(this.x - vec.x, this.y - vec.y);
  }
  // @endif

  // @ifdef VECTOR_SCALE
  /**
   * Calculate the multiple of the current vector by a value.
   * @memberof Vector
   * @function scale
   *
   * @param {Number} value - Value to scale the current Vector.
   *
   * @returns {Vector} A new Vector instance whose value is multiplied by the scalar.
   */
  scale(value: number) {
    return new MyVector(this.x * value, this.y * value);
  }
  // @endif

  // @ifdef VECTOR_NORMALIZE
  /**
   * Calculate the normalized value of the current vector. Requires the Vector [length](api/vector#length) function.
   * @memberof Vector
   * @function normalize
   *
   * @returns {Vector} A new Vector instance whose value is the normalized vector.
   */
  // @see https://github.com/jed/140bytes/wiki/Byte-saving-techniques#use-placeholder-arguments-instead-of-var
  normalize(length = this.length() || 1) {
    return new MyVector(this.x / length, this.y / length);
  }
  // @endif

  // @ifdef VECTOR_DOT||VECTOR_ANGLE
  /**
   * Calculate the dot product of the current vector with the given vector.
   * @memberof Vector
   * @function dot
   *
   * @param {Vector|{x: number, y: number}} vector - Vector to dot product against.
   *
   * @returns {Number} The dot product of the vectors.
   */
  dot(vec: MyVector) {
    return this.x * vec.x + this.y * vec.y;
  }
  // @endif

  // @ifdef VECTOR_LENGTH||VECTOR_NORMALIZE||VECTOR_ANGLE
  /**
   * Calculate the length (magnitude) of the Vector.
   * @memberof Vector
   * @function length
   *
   * @returns {Number} The length of the vector.
   */
  length() {
    return Math.hypot(this.x, this.y);
  }
  // @endif

  // @ifdef VECTOR_DISTANCE
  /**
   * Calculate the distance between the current vector and the given vector.
   * @memberof Vector
   * @function distance
   *
   * @param {Vector|{x: number, y: number}} vector - Vector to calculate the distance between.
   *
   * @returns {Number} The distance between the two vectors.
   */
  distance(vec: MyVector) {
    return Math.hypot(this.x - vec.x, this.y - vec.y);
  }
  // @endif

  // @ifdef VECTOR_DIRECTION
  /**
   * Calculate the angle (in radians) of the current vector.
   * @memberof Vector
   * @function direction
   *
   * @returns {Number} The angle (in radians) of the vector.
   */
  direction() {
    return Math.atan2(this.y, this.x);
  }

  /**
   * X coordinate of the vector.
   * @memberof Vector
   * @property {Number} x
   */
  get x() {
    return this._x;
  }

  /**
   * Y coordinate of the vector.
   * @memberof Vector
   * @property {Number} y
   */
  get y() {
    return this._y;
  }

  set x(value) {
    this._x = value;
  }

  set y(value) {
    this._y = value;
  }
  // @endif
}

export function Vector(x: number, y: number) {
  return new MyVector(x, y);
}
