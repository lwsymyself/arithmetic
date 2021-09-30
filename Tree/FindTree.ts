import { TNode } from "./Base";

interface FindNode {
  index: number;
  [str: string]: any;
}
//支持数字以及带有索引的类型
export type AcceptType = (FindNode | number)
function isNumber(num: AcceptType) {
  return typeof num === 'number'
}
export const eor = <T>(A: T, B: T) => {
  if (!!A && !B) {
    return A;
  }
  if (!A && !!B) {
    return B;
  }
  return null;
}
type hook = (tree: FindTree, element: FindTree) => {
  data: FindTree,
  action: 'return'
} | void

type afterType = 'insert' | 'delete' | 'find'
let returnNode: FindTree | undefined = undefined;
function handleAfterHook(hook: afterType, data: {
  element: FindTree, tree: FindTree
}, node: FindTree) {
  const obj = afterHook[hook](data.tree, data.element);
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
  'delete': () => void 0,
  'find': () => void 0
}
const afterHook: {
  [key in afterType]: hook
} = {
  'insert': () => void 0,
  'delete': () => void 0,
  'find': () => void 0
}
// let beforeInsert: hook = () => void 0;
// let afterInsert: hook = () => void 0;
const parseElement = (element: FindTree) => {
  if (typeof element.value === 'number') {
    return element.value;
  }
  const keys = Object.keys(element.value);
  if (keys.length === 1 && keys[0] === 'index') {
    return element.value['index']
  }
  return element.value;
}
const createElement = (element: AcceptType | FindTree) => element instanceof FindTree ? element : new FindTree(null, null, element);
const insert = (element: FindTree, tree: FindTree): FindTree => {
  if (tree === null) {
    return new FindTree(null, null, parseElement(element));
  }
  FindTree.beforeInsert(tree, element);
  if (tree.index < element.index) {
    //如果右部存在，则意味需要判断插入数据和右部数据的索引大小，于是递归调用insert函数。
    if (tree.right) {
      const node = insert(element, tree.right);
      return handleAfterHook('insert', {
        element, tree
      }, node);
    }
    else {
      const node = tree.right = new FindTree(null, null, parseElement(element));
      return handleAfterHook('insert', {
        element, tree
      }, node);
    }
  }
  if (tree.index > element.index) {
    //同理
    if (tree.left) {
      const node = insert(element, tree.left);
      return handleAfterHook('insert', {
        element, tree
      }, node);
    }
    else {
      const node = tree.left = new FindTree(null, null, parseElement(element));
      return handleAfterHook('insert', {
        element, tree
      }, node);
    }
  }
  //如果相等，则不插入该节点，直接返回子树。当然，也可以用链表保存索引相同的节点数据。
  return tree;
}
const del = (element: FindTree, tree: FindTree): FindTree | null => {
  if (tree === null) {
    return null;
  }
  if (element.index < tree.index) {
    if (tree.left) {
      //如果找不到，则最终会返回最后那个叶子节点，此时，tree.left会重新指向原来的叶子叶子节点，所以整个树会沿着查找路径重新赋一次值，但是树不会改变。
      tree.left = del(element, tree.left);
    }
  }
  if (element.index > tree.index) {
    if (tree.right) {
      tree.right = del(element, tree.right);
    }
  }
  if (element.index === tree.index) {
    const onlyNode = eor(tree.left, tree.right);
    if (onlyNode) {
      //如果只存在一个节点，则将该节点作为树节点。
      tree.value = onlyNode.value;
      tree.left = null;
      tree.right = null;
      afterHook['delete'](tree, element);
      return tree;
    }
    if (tree.left && tree.right) {
      const newRoot = FindTree.findMin(tree.right);
      // console.log(tree.right, newRoot);
      if (newRoot.parent?.left === newRoot) {
        newRoot.parent.left = null;
      } else if (newRoot.parent?.right === newRoot) {
        newRoot.parent.right = null;
      }
      newRoot.parent = tree.parent;
      newRoot.left = tree.left;
      newRoot.right = tree.right;
      if (newRoot.parent === null) {
        returnNode = newRoot;
      }
      afterHook['delete'](newRoot, element);
      return newRoot;
    }
    return null;
  }
  return handleAfterHook('delete', { tree, element }, tree);
}
// 递归定义，左边节点一定小于右边节点。
export class FindTree extends TNode<AcceptType, FindTree>{
  //因为左右节点已经固定，所以必须写成静态方法。
  //返回插入的节点元素
  insert(element: AcceptType | AcceptType[]): FindTree {
    returnNode = undefined;
    if (element instanceof Array) {
      element.forEach(item => insert(createElement(item), this));
    } else {
      insert(createElement(element), this);
    }
    return returnNode || this;
  }
  delete(element: AcceptType | AcceptType[]): FindTree {
    returnNode = undefined;
    if (element instanceof Array) {
      element.forEach(item => del(createElement(item), returnNode || this));
    } else {
      del(createElement(element), this);
    }
    return returnNode || this;
  }
  static findMin(tree: FindTree): FindTree {
    if (tree.left) {
      return this.findMin(tree.left);
    }
    return tree;
  }
  get index(): number {
    return typeof this.value === 'number' ? this.value : this.value.index
  }
  find(element: AcceptType | FindTree): FindTree | null {
    if (!this) {
      return null;
    }
    const wrapperElement = createElement(element);
    if (this.index === wrapperElement.index) {
      return this;
    }
    if (this.left) {
      if (this.left.index === wrapperElement.index) {
        return this.left;
      }
      if (this.left.index < wrapperElement.index) {
        return this.left.right?.find(wrapperElement) || null;
      } else {
        return this.left.left || null;
      }
    }
    if (this.right) {
      if (this.right.index === wrapperElement.index) {
        return this.right;
      }
      if (this.right.index < wrapperElement.index) {
        return this.right.left?.find(wrapperElement) || null;
      } else {
        return this.right.right?.find(wrapperElement) || null;
      }
    }
    return null;
  }

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

  static get afterDelete() {
    return afterHook['delete']
  }
  static set afterDelete(v: hook) {
    afterHook['delete'] = v;
  }
  static get afterFind() {
    return afterHook['find'];
  }
  static set afterFind(v: hook) {
    afterHook['find'] = v;
  }
}
// let findTree = new FindTree(null, null, 3);
// findTree.insert([10, 4, 2, 15, 7]);
// FindTree.levelTraversal(findTree);
// findTree.insert(4);
// findTree.insert()
// FindTree.insert(10, findTree);
// FindTree.insert(4, findTree);
// FindTree.insert(2, findTree);
// FindTree.insert(15, findTree);
// FindTree.insert(7, findTree);
// findTree.print();
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