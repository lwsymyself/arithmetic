function resolve(target: string, modify: string): number {
  const tLength = target.length;
  const mLength = modify.length;
  let dp: number[][] = new Array(tLength);
  for (let i = 0; i <= tLength; i++) {
    dp[i] = new Array(mLength);
  }
  for (let i = 0; i <= tLength; i++) {
    dp[i][0] = i;
  }
  for (let i = 0; i <= mLength; i++) {
    dp[0][i] = i;
  }
  for (let i = 1; i <= tLength; i++) {
    for (let j = 1; j <= mLength; j++) {
      if (target.charAt(i - 1) === modify.charAt(j - 1)) {
        dp[i][j] = dp[i - 1][j - 1];
        continue;
      }
      // 由于它一定会将每一种结果都判断一遍，所以不用重新赋值
      // if (i > tLength) {
      //   dp[i][j] = dp[i - 1][j - 1] + mLength - j;
      //   continue;
      // }
      // if (j > mLength) {
      //   dp[i][j] = dp[i - 1][j - 1] + tLength - i;
      //   continue;
      // }
      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
    }
  }
  return dp[tLength][mLength];
}
console.log(resolve('o', 'fkll'));