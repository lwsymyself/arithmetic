import { TNode } from "./Base";
import { AcceptType, FindTree } from "./FindTree";
//抽象了一层RotateTree，为之后的不同Tree做基础支撑。
//由于插入可能会破坏二叉树的结构。所以，平衡二叉树(AVLTree)在插入和删除的时候，都会顺便
export class RotateTree extends FindTree {
    //左旋：为了解决插入之后，高度差大于1的问题。
    //      A
    //    B
    //  D
    //变换后
    //     B
    //   D   A
    //如果B有右孩子，则挂到A的左边。
    static signleRotateWithLeft(tree: RotateTree) {
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
    //右旋：为了解决插入之后，高度差大于1的问题。旋转的本质就是让一个相邻的子节点变成父节点。
    //可以这么做的原因，A<B<C,假设B的左孩子为D，那么A<D<B<C，让B变为父节点，将D挂到A的右孩子上，这样的变换符合二叉查找树的定义
    //  A
    //    B
    //      C
    //变换后
    //     B
    //   A   C
    //如果B有左孩子，则挂到A的右边。
    static signleRotateWithRight(tree: RotateTree) {
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
    static doubleRotateWithLeft(tree: RotateTree) {
        if (tree.right) {
            RotateTree.signleRotateWithLeft(tree.right);
            const root = RotateTree.signleRotateWithRight(tree);
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
    static doubleRotateWithRight(tree: RotateTree) {
        if (tree.left) {
            RotateTree.signleRotateWithRight(tree.left);
            const root = RotateTree.signleRotateWithLeft(tree);
            //由于parent是自动赋值的，所以当需要更改根节点时，需要将新的根节点的父节点置空。
            if (root) {
                root.parent = null;
                return root;
            }
        }
    }
}