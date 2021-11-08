class MinHeap {
  private cup: (number[]) & { [str: number]: number };
  private size: number
  constructor(private capicaty: number) {
    this.cup = new Array(capicaty);
    this.cup[0] = Number.MIN_VALUE;
    this.size = 1;
  }
  public get min() {
    return this.cup[1];
  }
  public set value(num: number) {
    this.cup[this.size++] = num;
    let i = this.size;
    for (let parent = Math.floor(i / 2); i > 0 && this.cup[i] > this.cup[parent]; i = parent) {
      this.cup[parent] = this.cup[i];
    }
    this.cup[i] = num;
  }
  private precolate(index: number, opearte: 'up' | 'down') {
    if (opearte === 'up') {
      for (let i = index, parent = Math.floor(index / 2); this.cup[i] > this.cup[parent]; i = parent) {
        this.swap(i, parent);
      }
    } else {
      for (let i = index, min = this.cup[index * 2] < this.cup[index * 2 + 1] ? index * 2 : index * 2 + 1; this.cup[i] > this.cup[min]; i = min) {
        this.swap(i, min);
      }
    }
  }
  private swap(i: number, j: number) {
    let temp = this.cup[i];
    this.cup[i] = this.cup[j];
    this.cup[j] = temp;
  }

}
const heap = new MinHeap(12);
heap.value = 12;
heap.value = 1;
heap.value = 3;
console.log(heap.min);