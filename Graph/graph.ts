import { List } from "../ListNode/ListNode";
import { Queue } from "../Queue/Queue";
import { Stack } from "../Queue/Stack";
type ItemType<T> = { id: number, data: T, relation: List<{ cost?: number, id: number }> }
class Graph<T> {
  private _data: ItemType<T>[] = [];
  addPoint(data: T, relation?: {
    id: number,
    cost?: number
  }[] | number[]) {
    const item: ItemType<T> = {
      data,
      relation: new List(),
      id: this._data.length
    }
    if (relation)
      for (let i = 0; i < relation.length; i++) {
        let node = relation[i];
        if (node) {
          if (typeof node === 'number') {
            item.relation.insert({
              id: node
            })
          } else {
            item.relation.insert({
              cost: node.cost,
              id: node.id
            })
          }
        }
      }
    this._data.push(item);
    return item.id;
  }
  bfs(id: number, cb: (data: T, id: number, cost?: number) => void) {
    let queue = new Queue<{ data: T, cost?: number, id: number }>();
    let visited = new Set<number>();
    let node = this._data[id];
    const visitNode = (item: {
      cost?: number | undefined;
      id: number;
    } | undefined) => {
      const id = item?.id;
      if (item && id && !visited.has(id)) {
        visited.add(id);
        queue.item = { data: this._data[id].data, ...item };
      }
    }
    if (!node) {
      throw new Error("访问的节点未定义");
    } else {
      cb(node.data, node.id)
      node.relation.forEach(item => visitNode(item))
      for (let item of queue) {
        if (item) {
          let node = this._data[item.id]
          node.relation.forEach(item => visitNode(item))
          cb(item.data, item.id, item.cost)
        }
      }
    }
  }
  dfs(id: number, cb: (data: T, id: number, cost?: number) => void) {
    const stack = new Stack<{ data: T, cost?: number, id: number }>();
    const visited = new Set<number>();
    let node = this._data[id];
    const visitNode = (item: {
      cost?: number | undefined;
      id: number;
    } | undefined): void => {
      if (item && item.id && !visited.has(item.id)) {
        visited.add(item.id);
        stack.item = { data: this._data[item.id].data, ...item };
      }
    }
    if (!node) {
      throw new Error("访问的节点未定义");
    } else {
      cb(node.data, node.id);
      node.relation.forEach(item => visitNode(item));
      for (const item of stack) {
        if (item) {
          const node = this._data[item.id];
          node.relation.forEach(item => visitNode(item));
          cb(item.data, item.id, item.cost);
        }
      }
    }
  }
}
const graph = new Graph<number>();
graph.addPoint(0, [1, 2, 3])
graph.addPoint(2);
graph.addPoint(1, [4])
graph.addPoint(3, [5])
graph.addPoint(4, [6])
graph.addPoint(5);
graph.addPoint(6);