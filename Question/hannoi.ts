function Hannoi(begin: string, to: string, cache: string, num: number) {
  if (num === 1) {
    return console.log(begin, '->', to);
  }
  Hannoi(begin, cache, to, num - 1);
  console.log(begin, '->', to);
  Hannoi(cache, to, begin, num - 1);
}
Hannoi('a', 'c', 'b', 3);