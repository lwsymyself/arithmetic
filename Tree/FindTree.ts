import { TNode } from "./Base";

interface FindNode {
  index: number;
}
//支持数字以及带有索引的类型
export type AcceptType = FindNode | number;
function isNumber(num: AcceptType) {
  return typeof num === 'number'
}
//
export const eor = <T>(A: T, B: T) => {
  if (!!A && !B) {
    return A;
  }
  if (!A && !!B) {
    return B;
  }
  return null;
}
type hook = (element: AcceptType, tree: FindTree) => {
  data: FindTree,
  action: 'return'
} | void

type afterType = 'insert'
let returnNode: FindTree | undefined = undefined;
function handleAfterHook(hook: afterType, data: {
  element: AcceptType, tree: FindTree
}, node: FindTree) {
  const obj = afterHook[hook](data.element, data.tree);
  if (obj) {
    switch (obj.action) {
      case 'return':
        returnNode = obj.data;
    }
  }
  return node;
}
const beforeHook: {
  [key in afterType]: hook
} = {
  'insert': () => void 0,
}
const afterHook: {
  [key in afterType]: hook
} = {
  'insert': () => void 0
}
// let beforeInsert: hook = () => void 0;
// let afterInsert: hook = () => void 0;
let insert: (element: AcceptType, tree: FindTree) => FindTree = (element: AcceptType, tree: FindTree) => {
  if (tree === null) {
    return new FindTree(null, null, element);
  }
  FindTree.beforeInsert(element, tree);
  const nodeIndex = FindTree.getIndex(tree.value);
  const elementIndex = FindTree.getIndex(element);
  if (nodeIndex < elementIndex) {
    //如果右部存在，则意味需要判断插入数据和右部数据的索引大小，于是递归调用insert函数。
    if (tree.right) {
      const node = insert(element, tree.right);
      return handleAfterHook('insert', {
        element, tree
      }, node);
    }
    else {
      const node = tree.right = new FindTree(null, null, element);
      return handleAfterHook('insert', {
        element, tree
      }, node);
    }
  }
  if (nodeIndex > elementIndex) {
    //同理
    if (tree.left) {
      const node = insert(element, tree.left);
      return handleAfterHook('insert', {
        element, tree
      }, node);
    }
    else {
      const node = tree.left = new FindTree(null, null, element);
      return handleAfterHook('insert', {
        element, tree
      }, node);
    }
  }
  //如果相等，则不插入该节点，直接返回子树。当然，也可以用链表保存索引相同的节点数据。
  return tree;
}
// 递归定义，左边节点一定小于右边节点。
export class FindTree extends TNode<AcceptType>{

  static set beforeInsert(v: hook) {
    beforeHook['insert'] = v;
  }

  static set afterInsert(v: hook) {
    afterHook['insert'] = v;
  }

  static get beforeInsert() {
    return beforeHook['insert']
  }

  static get afterInsert() {
    return afterHook['insert']
  }

  //返回插入的节点元素
  static insert(element: AcceptType, tree: FindTree): FindTree {
    returnNode = undefined;
    insert(element, tree);
    return returnNode || tree;
  }
  static delete(element: AcceptType, tree: FindTree): FindTree | null {
    if (tree === null) {
      return null;
    }
    let nodeIndex = this.getIndex(tree.value);
    let elementIndex = this.getIndex(element);
    if (elementIndex < nodeIndex) {
      if (tree.left) {
        //如果找不到，则最终会返回最后那个叶子节点，此时，tree.left会重新指向原来的叶子叶子节点，所以整个树会沿着查找路径重新赋一次值，但是树不会改变。
        tree.left = this.delete(element, tree.left);
      }
    }
    if (elementIndex > nodeIndex) {
      if (tree.right) {
        tree.right = this.delete(element, tree.right);
      }
    }
    if (elementIndex === nodeIndex) {
      const onlyNode = eor(tree.left, tree.right);
      if (onlyNode) {
        //如果只存在一个节点，则将该节点作为树节点。
        tree.value = onlyNode.value;
        tree.left = null;
        tree.right = null;
        return tree;
      }
      if (tree.left && tree.right) {
        this.findMin(tree.right).left = tree.left;
        return tree.right;
      }
      return null;
    }
    return tree;
  }
  static findMin(tree: FindTree): FindTree {
    if (tree.left) {
      return this.findMin(tree.left);
    }
    return tree;
  }
  static getIndex(element: AcceptType): number {
    return typeof element === 'number' ? element : element.index
  }
}
// let findTree = new FindTree(null, null, 3);
// FindTree.insert(10, findTree);
// FindTree.insert(4, findTree);
// FindTree.insert(2, findTree);
// FindTree.insert(15, findTree);
// FindTree.insert(7, findTree);
// FindTree.delete(3, findTree);
// FindTree.print(findTree);
// console.log();
// console.log(FindTree.delete(5,findTree));
// try {
// FindTree.levelTraversal(findTree);
// const res = FindTree.delete(3, findTree);
// if (res) {
//   findTree = res;
// }
// FindTree.inorderTraversal(findTree);
// } catch (error) {
//   FindTree.inorderTraversal(findTree);
// }