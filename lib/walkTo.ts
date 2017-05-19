import { createNode, node } from './node';

type WalkToData<data> = {
  start: data;
  destination: data;
  getUniqueId: (data: data) => string;
  getNeighbors: (currentPos: data) => data[];
  priorityFunc: (currentPos: data, destination: data) => number;
  resistFunc: (src: data, next: data) => number;
  maxResist: number;
}

export function* walkTo<data>(pathingData: WalkToData<data>): IterableIterator<data> {
  const {
    start, destination,
    getUniqueId, getNeighbors,
    priorityFunc, resistFunc, maxResist
  } = pathingData;

  if (start === destination) {
    return destination;
  }

  let rootNode: node<data> = createNode<data>(getUniqueId(start), start, 0, priorityFunc(start, destination));
  let nodes: { [id: string]: node<data> } = { [rootNode.id]: rootNode };
  let newNeighbors: node<data>[] = [rootNode];

  while (newNeighbors[0].data !== destination) {
    if (rootNode.priority > maxResist) { return null; }
    newNeighbors =
      getNeighbors(rootNode.data)
        .map(neighbor => {
          const node = nodes[getUniqueId(neighbor)];
          if (node) {
            node.resist += rootNode.resist + resistFunc(rootNode.data, neighbor);
            node.priority = node.resist + priorityFunc(neighbor, destination);
            return node;
          } else {
            const resist = rootNode.resist + resistFunc(rootNode.data, neighbor);
            const priority = resist + priorityFunc(neighbor, destination);
            return createNode(
              getUniqueId(neighbor),
              neighbor,
              resist,
              priority,
              rootNode,
            );
          }
        })
        .sort((nodeA, nodeB) =>
          (nodeA.priority + Number(nodeA === rootNode) * nodeA.priority) - (nodeB.priority + Number(nodeB === rootNode) * nodeB.priority));

    newNeighbors.forEach(node => nodes[node.id] = node);

    rootNode = newNeighbors[0];
    yield rootNode.data;
  }

}
