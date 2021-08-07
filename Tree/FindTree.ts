import { TNode } from "./Base";

interface FindNode {
  index: number;
}
type AcceptType = FindNode | number;
function isNumber(num: AcceptType) {
  return typeof num === 'number'
}
const eor = <T>(A: T, B: T) => {
  if (!!A && !B) {
    return A;
  }
  if (!A && !!B) {
    return B;
  }
  return null;
}
class FindTree extends TNode<AcceptType>{
  static insert(element: FindNode | number, tree: FindTree): FindTree {
    if (tree === null) {
      return new FindTree(null, null, element);
    }
    let nodeIndex = typeof tree.value === 'number' ? tree.value : tree.value.index;
    let elementIndex = typeof element === 'number' ? element : element.index;
    if (nodeIndex < elementIndex) {
      if (tree.right)
        return this.insert(element, tree.right);
      else
        return tree.right = new FindTree(null, null, element);
    }
    if (nodeIndex > elementIndex) {
      if (tree.left)
        return this.insert(element, tree.left)
      else
        return tree.left = new FindTree(null, null, element)
    }
    return tree;
  }
  static delete(element: AcceptType, tree: FindTree): FindTree | null {
    if (tree === null) {
      return null;
    }
    let nodeIndex = typeof tree.value === 'number' ? tree.value : tree.value.index;
    let elementIndex = typeof element === 'number' ? element : element.index;
    if (elementIndex < nodeIndex) {
      if (tree.left) {
        tree.left = this.delete(element, tree.left);
      }
    }
    if (elementIndex > nodeIndex) {
      if (tree.right) {
        tree.right = this.delete(element, tree.right);
      }
    }
    if (elementIndex === nodeIndex) {
      const oneNode = eor(tree.left, tree.right);
      if (oneNode) {
        return oneNode;
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
}
let findTree = new FindTree(null, null, 3);
FindTree.insert(10, findTree);
FindTree.insert(4, findTree);
FindTree.insert(2, findTree);
FindTree.insert(15, findTree);
FindTree.insert(7, findTree);
// console.log();
// console.log(FindTree.delete(5,findTree));
// try {
// FindTree.levelTraversal(findTree);
const res = FindTree.delete(3, findTree);
if(res){
  findTree=res;
}
FindTree.inorderTraversal(findTree);
// } catch (error) {
//   FindTree.inorderTraversal(findTree);
// }