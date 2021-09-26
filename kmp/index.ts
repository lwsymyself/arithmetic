function getNextArray(str: string) {
  let k = -1, i = 0, array: number[] = [], len = str.length - 1;
  array[0] = -1;
  while (i < len) {
    if (k === -1 || str[i] === str[k]) {
      if (str[++i] === str[++k]) {
        array[i] = array[k];
        continue;
      }
      array[i] = k;
    } else {
      k = array[k];
    }
  }
  return array;
}
function kmp(target: string, pattern: string) {
  const nextArray = getNextArray(pattern);
  let i = 0, j = 0;
  for (; i < target.length && j < pattern.length;) {
    if (target[i] !== pattern[j]) {
      if (nextArray[j] === -1) {
        i++;
        continue;
      }
      j = nextArray[j];
    } else {
      i++;
      j++;
    }
  }
  return j === pattern.length ? i - j : -1;
}
console.log(kmp("", "asdes"));