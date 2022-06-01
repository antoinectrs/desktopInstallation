function myLerp(start, end, amt) {
  return (1 - amt) * start + amt * end
}
function mapRange(value, a, b, c, d) {
  value = (value - a) / (b - a);
  return c + value * (d - c);
}
function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}
function minIs(array) {
  return Math.min(...array);
}
function maxIs(array) {
  return Math.max(...array);
}
function mapArray(arr) {
  return arr.map(function (el) {
    return el.sample.audio.currentTime;
  });
};

function clamp(num, min, max) {
  if (min > max) [min, max] = [max, min]
  return Math.min(Math.max(num, min), max)
}

function smoothDamp(
  current,
  target,
  velocity,
  smoothness = 1,
  maxSpeed = Infinity,
  deltaTime = 0
) {
  let num = 2 / (smoothness || 0.00001)
  let num2 = num * deltaTime
  let num3 = 1 / (1 + num2 + 0.48 * num2 * num2 + 0.235 * num2 * num2 * num2)
  let num4 = current - target
  let num5 = target
  let num6 = maxSpeed * smoothness
  num4 = clamp(num4, -num6, num6)
  target = current - num4
  let num7 = (velocity + num * num4) * deltaTime
  velocity = (velocity - num * num7) * num3
  let value = target + (num4 + num7) * num3
  if (num5 - current > 0 === value > num5) {
    value = num5
    velocity = (value - num5) / deltaTime
  }
  return { value, velocity }
}