import uniqueId from 'lodash/uniqueId';
const uniqueMenuItemId = () => uniqueId('menu_item_');


export default [
  {
    id: uniqueMenuItemId(),
    link: '/cartogram-collection/list',
    name: '地图集合',
    iconType: 'mobile',
  },
  {
    id: uniqueMenuItemId(),
    link: '/cartogram/list',
    name: '地图',
    iconType: 'edit',
  },
  {
    id: uniqueMenuItemId(),
    link: '/layer/list',
    name: '图层',
    iconType: 'switcher',
  },
  {
    id: uniqueMenuItemId(),
    link: '/organization/list',
    name: '组织',
    iconType: 'team',
    role: 'mortal',
  },
  {
    id: uniqueMenuItemId(),
    link: '/user/profile',
    name: '个人信息',
    iconType: 'user-add',
    role: 'mortal',
  },
  {
    id: uniqueMenuItemId(),
    link: '/user/list',
    name: '用户管理',
    iconType: 'user',
    role: 'immortal',
  },
  {
    id: uniqueMenuItemId(),
    link: '/plan/list',
    name: 'Plan管理',
    iconType: 'setting',
    role: 'immortal',
  }
];
