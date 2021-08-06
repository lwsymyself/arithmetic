import { TNode } from "./Base";

interface FindNode {
  index: number;
}
function isNumber(num:FindNode|number){
  return typeof num === 'number'
}
class FindTree extends TNode<FindNode|number>{
  static insert(element: FindNode | number, tree: FindTree):FindTree {
    if (tree === null) {
      return new FindTree(null, null, element);
    }
    let nodeIndex =  typeof tree.value === 'number'? tree.value:  tree.value.index;
    let elementIndex =  typeof element === 'number'? element:  element.index;
    if ( nodeIndex < elementIndex) {
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
}
let findTree = new FindTree(null,null,3);
FindTree.insert(10,findTree);
FindTree.insert(4,findTree);
FindTree.insert(2,findTree);
FindTree.insert(7,findTree);
FindTree.inorderTraversal(findTree);