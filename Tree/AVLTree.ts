import { TNode } from "./Base";
import { AcceptType, FindTree } from "./FindTree";
import { RotateTree } from "./RotateTree";
//由于插入可能会破坏二叉树的结构。所以，平衡二叉树(AVLTree)在插入和删除的时候，都会顺便
class AVLTree extends RotateTree {

}
//在FindTree插入后，调用该函数。
RotateTree.afterInsert = (tree, element) => {
  const leftHeight = tree.left?.deep || 0;
  const rightHeight = tree.right?.deep || 0;
  let root: FindTree | undefined;
  if ((leftHeight - rightHeight) > 1 && tree.left) {
    if (element.index < tree.left.index) {
      //如果插入值小于树左孩子的值，代表肯定插到左孩子的左孩子上了。
      //满足ll，左单旋。
      root = AVLTree.signleRotateWithLeft(tree);
    } else {
      root = AVLTree.doubleRotateWithRight(tree);
    }
  } else if ((rightHeight - leftHeight) > 1 && tree.right) {
    //如果插入值大于树右孩子的值，代表肯定插到右孩子的右孩子上了。
    //满足rr，右单旋。
    if (element.index > tree.right.index) {
      root = AVLTree.signleRotateWithRight(tree);
    } else {
      root = AVLTree.doubleRotateWithLeft(tree);
    }
  }
  if (root) {
    root.parent = null;
    return {
      data: root,
      action: 'return'
    }
  }
}
RotateTree.afterDelete = (tree, element) => {
  const leftHeight = tree.left?.deep || 0;
  const rightHeight = tree.right?.deep || 0;
  //如果更改了树根，需要返回树根，让delete处理。
  let root: FindTree | undefined;
  if (leftHeight - rightHeight > 1 && tree.left) {
    //满足ll，可以单旋
    if (tree.left.left) {
      root = AVLTree.signleRotateWithLeft(tree);
    } else {
      //没有ll，只能双旋
      root = AVLTree.doubleRotateWithLeft(tree);
    }
  }
  if (rightHeight - leftHeight > 1 && tree.right) {
    if (tree.right.right) {
      root = AVLTree.signleRotateWithRight(tree);
    } else {
      root = AVLTree.doubleRotateWithLeft(tree);
    }
  }
  if (root) {
    root.parent = null;
    return {
      'action': 'return',
      'data': root
    };
  }
}
let tree: AVLTree = new AVLTree(null, null, 5);
// tree = AVLTree.insert(4, tree);
// tree = AVLTree.insert(7, tree);
// tree = AVLTree.insert(6, tree);
// tree = AVLTree.insert(3, tree);
// tree = AVLTree.insert(10, tree);
// tree = AVLTree.insert(2, tree);
tree = tree.insert([4, 7, 6, 3, 10, 2]);
tree = tree.delete([5,3]);
// tree = tree.delete(3);
// tree = AVLTree.delete(4, tree);
AVLTree.levelTraversal(tree);
//节点没有孩子时，两边都没有
// tree = AVLTree.insert(12, tree);
// tree = AVLTree.insert(4, tree);
// tree = AVLTree.insert(3, tree);
// tree = AVLTree.insert(11, tree);
// AVLTree.levelTraversal(tree);
// console.log(tree);