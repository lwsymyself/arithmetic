export class List<T> {
  private _len = 0;
  head: ListNode<T>;
  constructor() {
    this.head = new ListNode();
    this.head.id = -1;
  }
  insert(data: T, index?: number) {
    if (!index) {
      let node = this.head;
      let i = 0;
      while (node.next) {
        i++;
        node = node.next;
      }
      node.next = new ListNode(data);
      node.next.id = i;
    }
    this._len++;
  }
  delete(index?: number) {
    let node = this.head.next;
    while (node && node.next) {
      const next = node.next;
      if (index === undefined && !node.next.next) {
        this._len--;
        const item = node.next;
        node.next = null;
        return item;
      }
      if (next.id === index) {
        this._len--;
        node.next = next.next;
        return next;
      }
    }
  }
  get len() {
    return this._len;
  }
  forEach(cb: (data: T | undefined) => void) {
    let node = this.head.next;
    while (node) {
      cb(node.data)
      node = node.next;
    }
  }
  interrupt(cb: (data: T | undefined) => boolean) {
    let node = this.head.next;
    while (node && cb(node.data)) {
      node = node.next;
    }
  }
  print() {
    this.forEach(item => console.log(item))
  }
}
class ListNode<T> {
  data: T | undefined;
  id: number;
  next: ListNode<T> | null;
  constructor(data?: T) {
    this.data = data;
    this.next = null;
    this.id = -1;
  }
}