import { createNode, node } from './node';

type PathToData<data> = {
  start: data;
  destination: data;
  getUniqueId: (data: data) => string;
  getNeighbors: (currentPos: data) => data[];
  priorityFunc: (currentPos: data, destination: data) => number;
  resistFunc: (src: data, next: data) => number;
  maxResist: number;
}

export const pathTo =
  <data>(pathingData: PathToData<data>, debug?: (node: node<data>, nodes: node<data>[]) => void): data[] | null => {

    const {
      start, destination,
      getUniqueId, getNeighbors,
      priorityFunc, resistFunc, maxResist
    } = pathingData;

    if (start === destination) {
      return [destination];
    }

    let rootNode: node<data> = createNode<data>(getUniqueId(start), start, 0, priorityFunc(start, destination));
    let nodes: node<data>[] = [rootNode];


    while (nodes[0].data !== destination) {
      rootNode = nodes[0];
      debug && debug(rootNode, nodes);
      if (rootNode.priority > maxResist) { return null; }

      rootNode.hasBeenRoot = true;

      const neighbors = getNeighbors(rootNode.data);

      const newNeighbors =
        neighbors
          .filter(neighbor => !nodes.find(node => node.id === getUniqueId(neighbor)))
          .map(neighbor => createNode(
            getUniqueId(neighbor),
            neighbor,
            rootNode.resist + resistFunc(rootNode.data, neighbor),
            rootNode.resist + resistFunc(rootNode.data, neighbor) + priorityFunc(neighbor, destination),
            rootNode,
          ));

      nodes = nodes
        .concat(newNeighbors)
        .sort((nodeA, nodeB) => (nodeA.hasBeenRoot ? Number.MAX_VALUE : nodeA.priority) - (nodeB.hasBeenRoot ? Number.MAX_VALUE : nodeB.priority));

    }

    let endNode: node<data> | null = nodes[0];

    const path = [];

    while (endNode) {
      path.push(endNode.data);
      endNode = endNode.cameFrom;
    }

    return path.reverse();

  };
