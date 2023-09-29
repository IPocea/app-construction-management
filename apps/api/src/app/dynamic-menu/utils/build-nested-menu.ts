import { IDynamicMenu, IDynamicNestedMenu } from '../interface';

export function buildNestedMenu(
  dynamicMenuItems: IDynamicMenu[]
): IDynamicNestedMenu {
  const data = [];
  dynamicMenuItems.forEach((el) => {
    const _id = el._id;
    const newEl = {...el['_doc'], _id}
    data.push(newEl);
  });
  const idMapping = data.reduce((acc, el, i) => {
    acc[el._id] = i;
    return acc;
  }, {});
  let root: any;
  data.forEach((el) => {
    if (el.parentId === null) {
      root = el;
      return;
    }
    const parentEl: any = data[idMapping[el.parentId]];
    parentEl.children = [...(parentEl.children || []), el];
  });
  return root;
}
