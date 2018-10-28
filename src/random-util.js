// https://stackoverflow.com/a/47593316/10364396
export function mulberry32(a) {
  return function() {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// sample from poisson distribution, ala knuth. optionally uses a supplied rng function
export function poisson(lambda, rand = Math.random) {
  var L = Math.exp(-lambda);
  var k = 0;
  var p = 1;
  do {
    k++;
    p *= rand();
  } while (p > L);
  return k - 1;
}
