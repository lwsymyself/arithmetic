import { RotateTree } from "./RotateTree";

class SplayTree extends RotateTree {

}
SplayTree.afterFind = (tree, element) => {
    const leftHeight = tree.left?.deep || 0;
    const rightHeight = tree.right?.deep || 0;
    if (leftHeight - rightHeight > 1) {
        if (tree.left?.left?.index === element.index) {
            SplayTree.signleRotateWithLeft(tree.left);
            SplayTree.signleRotateWithLeft(tree);
            SplayTree.signleRotateWithLeft(tree);
        }
        if (tree.left?.right?.index === element.index) {
            SplayTree.doubleRotateWithRight(tree);
        }
    }
    if (rightHeight - leftHeight > 1) {
        if (tree.right?.right?.index === element.index) {
            SplayTree.signleRotateWithRight(tree.right);
            SplayTree.signleRotateWithRight(tree);
            SplayTree.signleRotateWithRight(tree);
        }
        if (tree.right?.left?.index === element.index) {
            SplayTree.doubleRotateWithLeft(tree);
        }
    }
}
let tree = new SplayTree(null, null, 10);
tree = tree.insert([9, 8, 6, 7]);
const resolve = tree.find(7);
if (resolve) {
    tree = resolve;
}
// console.log(resolve?.parent);
SplayTree.levelTraversal(tree);
