interface INode<T> {
  left: INode<T> | null,
  right: INode<T> | null,
  value: T,
  deep: number
}

function repeatString(str:string,num:number):string{
  if(num===0){
    return str;
  }else{
    return str += repeatString(str,num-1);
  }
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
  static levelTraversal<T>(node: INode<T>, cb: (item: (T|null)[],level:number) => void = (item,level) => console.log(level,item)) {
    let nodeList: (INode<T>|null)[] = [];
    nodeList.push(node);
    for (let i = 0; i < node.deep; i++) {
      for (let j = 0; j < 2 ** i; j++) {
        const left = nodeList[j]?.left;
        const right = nodeList[j]?.right;
        nodeList.push(left||null);
        nodeList.push(right||null);
      }
      cb(nodeList.splice(0, 2**i).map(item=>item&&item.value||null),i + 1);
    }
  }

  static print<T>(node: INode<T>) {
    //TODO 打印树形结构
    const lastLevel = 2**(node.deep-1) + 1;
    this.levelTraversal(node,(item,level)=>{
      console.log(repeatString(' ',Math.ceil(lastLevel/2**level))+item.join(repeatString(' ',Math.ceil(lastLevel/2**level))));
    })
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