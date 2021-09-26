class Stack<T> {
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
}