import { FindTree } from "./FindTree";
//由于插入可能会破坏二叉树的结构。所以，平衡二叉树(AVLTree)在插入和删除的时候，都会顺便
class AVLTree extends FindTree {
  static signleRotateWithLeft(tree: AVLTree) {
    //这里使用了parent去改变指向，也可以使用tree.right.left或者tree.left.left去代表高度差大于1的节点，此时他的parent为tree.right或tree.left。
    if (tree.left) {
      if (tree.parent) {
        //单旋步骤
        let newTree;
        if (tree.parent.left === tree) {
          newTree = tree.parent.left = tree.left;
        } else {
          newTree = tree.parent.right = tree.left;
        }
        tree.left = newTree.right;
        newTree.right = tree;
      } else {
        const parent = tree.left;
        tree.left = parent.right;
        parent.right = tree;
        return parent;
      }
    }
  }
  static signleRotateWithRight(tree: AVLTree) {
    if (tree.right) {
      if (tree.parent) {
        let newRoot;
        if (tree.parent.left === tree) {
          newRoot = tree.parent.left = tree.right;
        } else {
          newRoot = tree.parent.right = tree.right;
        }
        tree.right = newRoot.left;
        newRoot.left = tree;
      }
      else {
        const newRoot = tree.right;
        tree.right = newRoot.left;
        newRoot.left = tree;
        return newRoot;
      }
    }
  }
  static doubleRotateWithLeft(tree: AVLTree) {
    if (tree.right && tree.right.left) {
      AVLTree.signleRotateWithLeft(tree.right);
      const root = AVLTree.signleRotateWithRight(tree);
      if (root) {
        root.parent = null;
        return root;
      }
    }
  }
  static doubleRotateWithRight(tree: AVLTree) {
    if (tree.left && tree.left.right) {
      AVLTree.signleRotateWithRight(tree.left);
      const root = AVLTree.signleRotateWithLeft(tree);
      if (root) {
        root.parent = null;
        return root;
      }
    }
  }
}
FindTree.afterInsert = (element, tree) => {

  const leftHeight = tree.left?.deep || 0;
  const rightHeight = tree.right?.deep || 0;
  if ((leftHeight - rightHeight) > 1 && tree.left) {
    const elementIndex = FindTree.getIndex(element);
    const treeIndex = FindTree.getIndex(tree.left.value);
    if (elementIndex < treeIndex) {
      const root = AVLTree.signleRotateWithLeft(tree);
      if (root) {
        return {
          data: root,
          action: 'return'
        }
      }
    } else {
      const root = AVLTree.doubleRotateWithRight(tree);
      if (root) {
        return {
          action: 'return',
          data: root
        }
      }
    }
  }
  if ((rightHeight - leftHeight) > 1 && tree.right) {
    const elementIndex = FindTree.getIndex(element);
    const treeIndex = FindTree.getIndex(tree.right.value);
    if (elementIndex > treeIndex) {
      const root = AVLTree.signleRotateWithRight(tree);
      if (root) {
        return {
          data: root,
          action: 'return'
        }
      }
    } else {
      const root = AVLTree.doubleRotateWithLeft(tree);
      if (root) {
        return {
          action: 'return',
          data: root
        }
      }
    }
  }
}
let tree = new AVLTree(null, null, 6);
tree = AVLTree.insert(8, tree);
tree = AVLTree.insert(7, tree);
tree = AVLTree.insert(9, tree);
tree = AVLTree.insert(12, tree);
tree = AVLTree.insert(4, tree);
tree = AVLTree.insert(3, tree);
tree = AVLTree.insert(11, tree);
AVLTree.levelTraversal(tree);
// console.log(tree);