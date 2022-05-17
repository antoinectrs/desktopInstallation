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


