import { stdout } from 'process';
import { pathTo, walkTo, /*getReachable*/ } from '../lib';
import { createMap, logMap } from './util';

// type = 'visualizer' or 'benchmark'
// method = 'pathTo', 'walkTo' or 'getReachable'
const [type = 'visualizer', method = 'pathTo', sizeValue = '32'] = process.argv.slice(2);
const size = Number(sizeValue);

function resetConsole() {
  return stdout.write('\x1Bc');
}

const getNeighbors = <data>(x: number, y: number, map: data[][]): data[] => {
  const neighbors = [];
  for (let i = -1; i < 2; ++i) {
    for (let h = -1; h < 2; ++h) {
      if (!(i === 0 && h === 0)) {
        const nY = y + i;
        const nX = x + h;
        if (map[nY] && map[nY][nX]) {
          neighbors.push(map[nY][nX]);
        }
      }
    }
  }
  return neighbors;
}

const randomInt = (cap: number): number => Math.floor(Math.random() * (cap + 1));

const map = createMap(size, size, () => randomInt(9));

type TestData = {
  x: number;
  y: number;
  value: number;
}

if (type === 'visualizer') {
  if (method === 'pathTo') {
    let pI = 0;
    let touchedItems: TestData[] = [];
    const result = pathTo<TestData>({
      start: map[0][0],
      destination: map[size - 1][size - 1],
      getUniqueId: ({ x, y }) => `${x}-${y}`,
      getNeighbors: ({ x, y }) => getNeighbors<TestData>(x, y, map),
      resistFunc: (src, next) => Math.abs(src.value - next.value) + next.value,
      priorityFunc: (pos, dest) => 5 * Math.sqrt(Math.pow(Math.abs(pos.x - dest.x), 2) + Math.pow(Math.abs(pos.y - dest.y), 2)),
      maxResist: Number.MAX_VALUE,
    }, (root, touched) => {
      const rootItem = root.data;
      touchedItems = touched.map(node => node.data);
      setTimeout(() => {
        resetConsole();
        logMap<TestData>(map, ({ value }) => value, {
          focused: rootItem,
          touched: touchedItems
        });
      }, ++pI * 250);
    });
    setTimeout(() => {
      resetConsole();
      logMap<TestData>(map, ({ value }) => value, {
        focused: map[size - 1][size - 1],
        path: result || [],
        touched: touchedItems,
      });
    }, pI + 2 * 250);
  } else if (method === 'walkTo') {
    const path: TestData[] = []
    const pathing = walkTo<TestData>({
      start: map[0][0],
      destination: map[size - 1][size - 1],
      getUniqueId: ({ x, y }) => `${x}-${y}`,
      getNeighbors: ({ x, y }) => getNeighbors<TestData>(x, y, map),
      resistFunc: (src, next) => Math.abs(src.value - next.value) + next.value,
      priorityFunc: (pos, dest) => 5 * Math.sqrt(Math.pow(Math.abs(pos.x - dest.x), 2) + Math.pow(Math.abs(pos.y - dest.y), 2)),
      maxResist: Number.MAX_VALUE,
    });

    function iterateOverPath() {
      resetConsole();
      const { value: rootItem, done } = pathing.next();
      path.push(rootItem);
      logMap<TestData>(map, ({ value }) => value, {
        focused: rootItem,
        path: path,
      });
      if (!done) {
        setTimeout(iterateOverPath, 250);
      }
    }

    iterateOverPath();
  }
} else if (type === 'benchmark') {

}

