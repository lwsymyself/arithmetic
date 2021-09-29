import { TNode } from "./Base";
import { AcceptType, FindTree } from "./FindTree";
//由于插入可能会破坏二叉树的结构。所以，平衡二叉树(AVLTree)在插入和删除的时候，都会顺便
class AVLTree extends FindTree {
  //左旋：为了解决插入之后，高度差大于1的问题。
  //      A
  //    B
  //  D
  //变换后
  //     B
  //   D   A
  //如果B有右孩子，则挂到A的左边。
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
  //右旋：为了解决插入之后，高度差大于1的问题。
  //  A
  //    B
  //      C
  //变换后
  //     B
  //   A   C
  //如果B有左孩子，则挂到A的右边。
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
  //    A
  //      B
  //    C
  //第一步变换，以B为中心，进行左旋
  //    A
  //      C
  //        B
  //第二步变换，以C为中心，进行右旋。
  //  C
  //A   B 
  static doubleRotateWithLeft(tree: AVLTree) {
    if (tree.right) {
      AVLTree.signleRotateWithLeft(tree.right);
      const root = AVLTree.signleRotateWithRight(tree);
      if (root) {
        //由于parent是自动赋值的，所以当需要更改根节点时，需要将新的根节点的父节点置空。
        root.parent = null;
        return root;
      }
    }
  }
  //    A
  //  B
  //    C
  //第一步变换，以B为中心，进行右旋
  //    A
  //  C
  //B
  //第二步变换，以C为中心，进行左旋。
  //  C
  //B   A 
  //原因：根据二叉查找树的定义，B<C<A，要想让树恢复平衡，则必须让C作为根节点。然而，一次旋转，只能让相邻的子节点向变为父节点。所以，需要两次旋转，才能让C变到C的父节点的父节点。
  static doubleRotateWithRight(tree: AVLTree) {
    if (tree.left) {
      AVLTree.signleRotateWithRight(tree.left);
      const root = AVLTree.signleRotateWithLeft(tree);
      //由于parent是自动赋值的，所以当需要更改根节点时，需要将新的根节点的父节点置空。
      if (root) {
        root.parent = null;
        return root;
      }
    }
  }
}
//在FindTree插入后，调用该函数。
FindTree.afterInsert = (tree, element) => {
  const leftHeight = tree.left?.deep || 0;
  const rightHeight = tree.right?.deep || 0;
  let root: TNode<AcceptType> | undefined;
  if ((leftHeight - rightHeight) > 1 && tree.left) {
    const elementIndex = FindTree.getIndex(element);
    const treeIndex = FindTree.getIndex(tree.left.value);
    if (elementIndex < treeIndex) {
      root = AVLTree.signleRotateWithLeft(tree);
    } else {
      root = AVLTree.doubleRotateWithRight(tree);
    }
  } else if ((rightHeight - leftHeight) > 1 && tree.right) {
    const elementIndex = FindTree.getIndex(element);
    const treeIndex = FindTree.getIndex(tree.right.value);
    //如果插入值大于树右孩子的值，代表肯定插到右孩子的右孩子上了。
    //符合一条线，右旋。
    if (elementIndex > treeIndex) {
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
FindTree.afterDelete = (tree, element) => {
  const leftHeight = tree.left?.deep || 0;
  const rightHeight = tree.right?.deep || 0;
  //如果更改了树根，需要返回树根，让delete处理。
  let root: TNode<AcceptType> | undefined;
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
tree = AVLTree.insert(4, tree);
tree = AVLTree.insert(7, tree);
tree = AVLTree.insert(6, tree);
tree = AVLTree.insert(3, tree);
tree = AVLTree.insert(10, tree);
tree = AVLTree.insert(2, tree);
tree = AVLTree.delete(10, tree);
tree = AVLTree.delete(4, tree);
AVLTree.levelTraversal(tree);
//节点没有孩子时，两边都没有
// tree = AVLTree.insert(12, tree);
// tree = AVLTree.insert(4, tree);
// tree = AVLTree.insert(3, tree);
// tree = AVLTree.insert(11, tree);
// AVLTree.levelTraversal(tree);
// console.log(tree);