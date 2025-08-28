export class MyVector {
  x: number = 0;
  y: number = 0;
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  add(vec: MyVector) {
    return new MyVector(this.x + vec.x, this.y + vec.y);
  }

  subtract(vec: MyVector) {
    return new MyVector(this.x - vec.x, this.y - vec.y);
  }

  scale(value: number) {
    return new MyVector(this.x * value, this.y * value);
  }

  normalize(length = this.length() || 1) {
    return new MyVector(this.x / length, this.y / length);
  }

  dot(vec: MyVector) {
    return this.x * vec.x + this.y * vec.y;
  }

  length() {
    return Math.hypot(this.x, this.y);
  }

  distance(vec: MyVector) {
    return Math.hypot(this.x - vec.x, this.y - vec.y);
  }
}

export function Vector(x: number, y: number) {
  return new MyVector(x, y);
}
