interface INode<T> {
  left: INode<T> | null,
  right: INode<T> | null,
  value: T
}

export class TNode<T> implements INode<T> {
  constructor(public left: INode<T> | null, public right: INode<T> | null, public value: T) {

  }
  static preorderTraversal<T>(node: INode<T>, cb: (item: T) => void = item => { console.log(item) }) {
    node.value && cb(node.value);
    node.left && this.preorderTraversal(node.left, cb);
    node.right && this.preorderTraversal(node.right, cb);
  }
  static postorderTraversal<T>(node: INode<T>, cb: (item: T) => void = item => { console.log(item) }) {
    node.left && this.postorderTraversal(node.left, cb);
    node.right && this.postorderTraversal(node.right, cb);
    node.value && cb(node.value);
  }
  static inorderTraversal<T>(node: INode<T>, cb: (item: T) => void = item => { console.log(item) }) {
    node.left && this.inorderTraversal(node.left, cb);
    node.value && cb(node.value);
    node.right && this.inorderTraversal(node.right, cb);
  }
}
let node = new TNode(null, null, 1);