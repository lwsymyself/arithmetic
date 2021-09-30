function repeatString(str: string, num: number): string {
  if (num === 0) {
    return str;
  } else {
    return str += repeatString(str, num - 1);
  }
}

export class TNode<T, K extends TNode<T, K>> {
  private _left: K | null = null
  private _right: K | null = null

  constructor(left: K | null, right: K | null, public value: T, public parent: K | null = null) {
    this.left = left
    this.right = right
  }
  get left() {
    return this._left;
  }
  set left(v: K | null) {
    //由于没有指针，后期的一些算法不好实现，所以增加了parent这个字段，比如之后的左旋右旋...如果不使用parent，则算法描述会不清楚，增加了理解成本。
    this._left = v;
    if (v !== null && this._left) {
      this._left.parent = this as unknown as K;
    }
  }
  get right() {
    return this._right;
  }
  set right(v: K | null) {
    this._right = v;
    if (v !== null && this._right) {
      this._right.parent = this as unknown as K;
    }
  }
  static preorderTraversal<T, K extends TNode<T, K>>(node: TNode<T, K>, cb: (item: T) => void = item => { console.log(item) }) {
    node.value && cb(node.value);
    node.left && this.preorderTraversal(node.left, cb);
    node.right && this.preorderTraversal(node.right, cb);
  }
  static postorderTraversal<T, K extends TNode<T, K>>(node: TNode<T, K>, cb: (item: T) => void = item => { console.log(item) }) {
    node.left && this.postorderTraversal(node.left, cb);
    node.right && this.postorderTraversal(node.right, cb);
    node.value && cb(node.value);
  }
  static inorderTraversal<T, K extends TNode<T, K>>(node: TNode<T, K>, cb: (item: T) => void = item => { console.log(item) }) {
    node.left && this.inorderTraversal(node.left, cb);
    node.value && cb(node.value);
    node.right && this.inorderTraversal(node.right, cb);
  }
  static levelTraversal<T, K extends TNode<T, K>>(node: TNode<T, K>, cb: (item: (T | null)[], level: number) => void = (item, level) => console.log(level, item)) {
    let nodeList: (TNode<T, K> | null)[] = [];
    nodeList.push(node);
    for (let i = 0; i < node.deep; i++) {
      for (let j = 0; j < 2 ** i; j++) {
        const left = nodeList[j]?.left;
        const right = nodeList[j]?.right;
        nodeList.push(left || null);
        nodeList.push(right || null);
      }
      cb(nodeList.splice(0, 2 ** i).map(item => item && item.value || null), i + 1);
    }
  }

  static print<T, K extends TNode<T, K>>(node: TNode<T, K>) {
    //TODO 打印树形结构
    const lastLevel = 2 ** (node.deep - 1) + 1;
    this.levelTraversal(node, (item, level) => {
      console.log(repeatString(' ', Math.ceil(lastLevel / 2 ** level)) + item.join(repeatString(' ', Math.ceil(lastLevel / 2 ** level))));
    })
  }
  static getChild<T, K extends TNode<T, K>>(tree: TNode<T, K>) {
    if (tree.parent) {
      return tree.parent.left === tree ? tree.parent.left : tree.parent.right
    }
    throw new Error("tree.parent is undefined");
  }
  get deep(): number {
    if (!this.left && !this.right) {
      return 1;
    }
    if (!this.right && this.left) {
      return this.left.deep + 1;
    }
    if (!this.left && this.right) {
      return this.right.deep + 1;
    }
    if (this.left && this.right) {
      const lDeep = this.left.deep;
      const rDeep = this.right.deep;
      return Math.max(lDeep, rDeep) + 1;
    }
    return 0;
  }
}
let node = new TNode(null, null, 1);