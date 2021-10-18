export class Stack<T> {
  private _self: T[] = [];
  get item() {
    return this._self[this._self.length - 1];
  }
  set item(v) {
    this._self.push(v);
  }
  drop() {
    return this._self.pop();
  }
  isEmpty() {
    return this._self.length === 0
  }
  [Symbol.iterator]() {
    return {
      next: () => {
        let data = this.drop();
        return {
          value: data,
          done: data === undefined ? true : false
        }
      }
    }
  }
}