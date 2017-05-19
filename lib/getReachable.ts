import { createNode, node } from './node';

type ReachableData<data> = {
  start: data;
  getUniqueId: (data: data) => string;
  getNeighbors: (currentPos: data) => data[];
  resistFunc: (src: data, next: data) => number;
  maxResist: number;
}

export function getReachable<data>(pathingData: ReachableData<data>) {
  const {
    start,
    getUniqueId,
    getNeighbors,
    resistFunc,
    maxResist,
  } = pathingData;

  let rootNode: node<data> = createNode<data>(getUniqueId(start), start, 0, 0);
  let nodes: node<data>[] = [rootNode];
  let results: node<data>[] = [];

  while (nodes.find(node => !node.hasBeenRoot)) {
    rootNode = nodes.shift() || nodes[0];
    results.push(rootNode);
    rootNode.hasBeenRoot = true;

    nodes = getNeighbors(rootNode.data)
      .map(neighbor => createNode(
        getUniqueId(neighbor),
        neighbor,
        rootNode.resist + resistFunc(rootNode.data, neighbor),
        0,
        rootNode,
      ))
      .filter(node =>
        nodes.indexOf(node) === -1 &&
        results.indexOf(node) === -1 &&
        !node.hasBeenRoot &&
        node.resist <= maxResist)
      .concat(nodes);

  }

  return results;

}