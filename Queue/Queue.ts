export class Queue<T>{
  private items: T[] = [];
  get item() {
    return this.items[0]
  }
  set item(v) {
    this.items.push(v);
  }
  drop() {
    return this.items.shift();
  }
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        index++;
        let data = this.drop();
        return {
          value: data,
          done: data === undefined ? true : false
        }
      }
    }
  }
}