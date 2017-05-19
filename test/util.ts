import * as chalk from 'chalk';

export const createMap =
  <data>(x: number, y: number, render: (x: number, y: number) => data) =>
    (new Array(y))
      .fill(new Array(x).fill(0))
      .map((row, y) => row.map((_: 0, x: number) => ({
        x, y,
        value: render(x, y)
      })));


const colorNumber =
  (value: number, options: { isFocused?: boolean, onPath?: boolean, hasBeenTouched?: boolean }) => {
    const { isFocused, onPath, hasBeenTouched } = options;
    let render = hasBeenTouched ? chalk.bgGreen : chalk;
    render = onPath ? render.bgYellow : render;
    render = isFocused ? render.bgWhite : render;
    return value > 8 ? render.red(value + '') :
      value > 6 ? render.magenta(value + '') :
        value < 2 ? render.cyan(value + '') :
          value < 4 ? render.blue(value + '') :
            render.green(value + '');
  };

export const logMap = <data>(map: data[][], render: (val: data) => number, options: { focused?: data, path?: data[], touched?: data[] }) => {
  const { focused, path, touched } = options;
  map.forEach(row => console.log(
    row.map(
      data => colorNumber(render(data), {
        isFocused: focused && focused === data,
        onPath: path && path.indexOf(data) !== -1,
        hasBeenTouched: touched && touched.indexOf(data) !== -1,
      })
    ).join(' ')
  ));
};
