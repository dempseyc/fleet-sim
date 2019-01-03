export function randomMM (min,max) {
  return Math.floor(Math.random()*max-min)+min;
};

export function squareNum (n) {
  return Math.pow(n,2);
};

function getMean (arr) {
  let n = arr.length;
  let sum = arr.reduce((a,c) => c + a );
  return sum/n;
}

export function stanDev (arr) {
  let mean = getMean(arr);
  console.log(mean);
  let dev = arr.map((i) => squareNum(i-mean) )
  let sd = Math.sqrt(getMean(dev));
  return sd;
}