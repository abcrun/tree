function getNodeWidthOrHeight(node, v) {
  switch (typeof v) {
    case 'function':
      return v(node);
    case 'number':
      return v;
    default:
      return 20;
  }
}

function initNode(node, options) {
  const { width: w, height: h, direction, offset } = options;
  const width = getNodeWidthOrHeight(node, w);
  const height = getNodeWidthOrHeight(node, h);

  const { parent } = node;
  const { left: l, top: t, width: pw, height: ph } = parent ? parent.style : {};
  let top = 0;
  let left = 0;

  if (parent) {
    if (direction === 'hv') {
      top = t + ph + offset.y;
    } else {
      left = l + pw + offset.x;
    }
  }

  node.style = { top, left, width, height };
}

function tree(obj, options, parent = null) {
  const root = parent ? obj : { index: 0, children: [obj] };

  const { index = 0, children = [] } = root;
  const data = children[index];
  const { children: sub = [], ...props } = data;

  const level = parent ? parent.level + 1 : 0;
  const current = {
    level,
    index,
    parent,
    data: props,
  };

  initNode(current, options);

  const list = sub.map((child, i) =>
    tree({ index: i, children: sub }, options, current)
  );
  list.forEach((item, i) => {
    if (i === 0) current.first = item;
    if (i === list.length - 1) current.last = item;

    item.prev = list[i - 1] || null;
    item.next = list[i + 1] || null;
  });

  current.children = list;

  return current;
}

const moveParents = (node, options) => {
  let current = node;
  const { direction } = options;
  const { width, height } = current.style;

  while (current.parent) {
    const { left, top } = current.style;
    const { left: lstart, top: tstart } = current.parent.first.style;
    current = current.parent;

    const { width: pwidth, height: pheight } = current.style;
    if (direction === 'hv') {
      const offset = (left + width - lstart) / 2;

      current.style.left = lstart + offset - pwidth / 2;
    } else {
      const offset = (top + height - tstart) / 2;

      current.style.top = tstart + offset - pheight / 2;
    }
  }
};

const move = (node, options) => {
  const current = node;
  const { offset, direction } = options;
  const { width: pw, height: ph, top: pt, left: pl } = current.prev.style;

  let base = current.prev;
  if (current.prev.last) {
    const {
      width: plw,
      height: plh,
      top: plt,
      left: pll,
    } = current.prev.last.style;

    if ((direction === 'hw' && pll + plw > pl + pw) || plt + plh > pt + ph) {
      base = current.prev.last;
    }
  }

  const { left, top, width, height } = base.style;
  if (direction === 'hv') {
    current.style.left = left + width + offset.x;
  } else {
    current.style.top = top + height + offset.y;
  }

  moveParents(current, options);
};

const moveSiblings = (node, options) => {
  let current = node;

  while (current.next) {
    current = current.next;
    move(current, options);

    if (current.first) {
      // eslint-disable-next-line
      walkTree(current, options);
    }
  }

  return current;
};

function walkTree(node, options) {
  let current = node;
  const { direction } = options;
  const { left, top, width, height } = current.style;

  while (current.first) {
    current = current.first;

    const { width: fwidth, height: fheight } = current.style;
    if (direction === 'hv') {
      current.style.left = left + (width - fwidth) / 2;
    } else {
      current.style.top = top + (height - fheight) / 2;
    }
  }

  if (current.next) {
    moveSiblings(current, options);
  }

  while (current.parent) {
    current = current.parent;
    moveSiblings(current, options);
  }
}

export default class Tree {
  static create(data, options) {
    const t = tree(data, options);
    walkTree(t, options);

    return t;
  }
}
