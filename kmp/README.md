# KMPyyds

## 问题

给定一个目标串(target string)和一个模式串(pattern string)，请问返回模式串在匹配串中的位置，如果没有，就返回-1。和 indexOf 一样。

## 算法思路

将两个串进行对比，如果前 n 个字符相同，那么前 n-1 个肯定也相同。
由于匹配串从第一个字符开始，并且前面的串是完全匹配的，还会前移 p 串相对于 t 串的最长公共部分，所以不可能漏掉匹配项。

## 实现步骤

将 p 串和 t 串进行比较，当不相符的时候，后移 p 串和 t 串公共部分的长度。重新比较。
t 串:ABCABCDAB
p 串:ABCDA
过程如下：
A=A B=B C=C
然后发现 A!=D，于是，前移 p 串 到下标 0 ，令 A=A，重新比较。
t 串:ABCABCABD
p 串:ABCABD
过程如下：
A=A B=B...
然后发现 C!=D，于是，前移 p 串到下标 2，令 C=C，重新比较。
这里就要牵扯移动的下标了，将遇到的 p 串中不匹配下标记为 j，t 串中记为 i。对于 p 串来说，j 之前的后缀子串和从 0 开始的前缀子串是有重复的，并且 j 之前的和 i 到 i-j 之前的字符串是完全匹配的。所以，可以这么说 p 串中 j 之前的字符串代表了 t 串中 i 之前的字符串。
比如 AB 就重复了，长度为 2。所以才可以移动 p 串到下标 2。对于那种没有重复的，就直接移到 下标 0 就好。

## 求 k 数组

那么，下来的算法逻辑就很简单了，找到 p 串中，每一个长度的子串中的前缀与后缀重复的个数，他可以指导我们怎么移动 p 串。
比如 ABCAB
他的数组就是[0,0,0,0,1]因为以 B 结尾时，并不包括 B。

实现

```ts
function getNextArray(str: string) {
  let k = -1, //从0开始的重复字符长度
    i = 0, //字符串下标
    array: number[] = [],
    len = str.length - 1;
  array[0] = -1;
  while (i < len) {
    //当没有重复字符时，k就会等于-1。
    if (k === -1 || str[i] === str[k]) {
      //两个++确保他i和k指的都是下一个字符，也就保证了数组的值为i之前的重复字符串长度。
      //如果字符串下一个值是相等的，那么就让数组中i下标的值和数组起使位置k下标的值相同，这样可以避免一些无意义的判断。
      if (str[++i] === str[++k]) {
        array[i] = array[k];
        continue;
      }
      array[i] = k;
    } else {
      //如果没有重复的，那么k的值会为0，所以array[k]的值会为-1，进而k的值被赋值为-1。-1就代表没有匹配的字符
      k = array[k];
    }
  }
  return array;
}
```
