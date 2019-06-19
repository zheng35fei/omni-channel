import { apiGet, apiPost } from '../../fetch/api';
import adminApi from '../../fetch/adminApi.js';

/**
 * 组装路由
 * @param {array} funNameArr 菜单名称
 * @param {array} funCodeArr 路由唯一编码
 * @param {string} funUrl 路由地址
 * @param {string} funType 菜单类型 menu column button
 */
function buildComponents(funNameArr, funCodeArr, funUrl, funType) {
  const meta = {
    breadcrumbList: funNameArr,
    belongTab: funCodeArr[0],
    openName: funCodeArr[1],
    funType
  };
  const componentsArr = funCodeArr.join('/');
  return {
    path: funUrl.startsWith('/') ? funUrl : '/' + funUrl,
    name: funCodeArr[funCodeArr.length - 1],
    component: resolve => {
      require([`@/components/${componentsArr}`], resolve);
    },
    meta: meta
  };
}

/**
 * 平行数组转树型数组
 * @param {array} list 平行数组
 * @param {obj} parentObj 待生成树型对象
 * @param {string} parentKey 父节点key
 * @param {string} childNode 子节点key
 */
function switchTree(
  list,
  parentObj,
  parentKey = 'parentId',
  childNode = 'children'
) {
  parentObj[childNode] = list.filter(item => {
    return !item[parentKey];
  });

  list.forEach(item => {
    const parentId = item[parentKey];
    if (typeof parentId != 'undefined') {
      makeTree(parentObj[childNode]);

      function makeTree(childArr) {
        childArr.some(child => {
          if (parentId === child.id) {
            child[childNode] = child[childNode] || [];
            child[childNode].push(item);
            return true;
          } else if (child[childNode] && child[childNode].length > 0) {
            makeTree(child[childNode]);
          }
        });
      }
    }
  });
}

/**
 * 生成路由
 * @param {array} list 菜单列表
 * @param {array} funNameArr 菜单名称层级
 * @param {array} funCodeArr 菜单唯一编码层级 
 */
function buildMenu(routes, list, funNameArr = [], funCodeArr = [], index = 0) {
  list.forEach(item => {
    if(!item.parentId) {
      funNameArr = []
      funCodeArr = []
    }
    funNameArr.splice(index);
    funCodeArr.splice(index);
    funNameArr.push(item.funName);
    funCodeArr.push(item.funCode);
    if (!item.list) {
      let nameArr = [...funNameArr]
      let codeArr = [...funCodeArr]
      const itemRouter = buildComponents(
        nameArr,
        codeArr,
        item.funUrl,
        item.functionType
      );
      routes.push(itemRouter);
    } else {
      buildMenu(routes, item.list, funNameArr, funCodeArr, index + 1);
    }
  });
}

function uniqueArr(arr, key) {
  for (var i = 0; i < arr.length; i++) {
      for (var j = i + 1; j < arr.length; j++) {
          if (key ? arr[i][key] == arr[j][key] : arr[i] == arr[j]) {
              //第一个等同于第二个，splice方法删除第二个
              arr.splice(j, 1)
              j--
          }
      }
  }
  return arr
}

const state = {
  menuList: [],
  activeName: '',
  openName: '',
  asyncRouter: '',
  breadcrumbList: []
};
const getters = {};

const mutations = {
  updateMenulist(state) {},
  setActiveName(state, name) {
    state.activeName = name;
  },
  setOpenName(state, name) {
    state.openName = name;
  },
  setBreadcrumbList(state, name) {
    state.breadcrumbList = name;
  },
  // 根据权限生成路由
  formaterRouter(state) {
    let roleRouter = [];
    if (!state.menuList.length) {
      return;
    }
    buildMenu(roleRouter, state.menuList);
    // roleRouter = uniqueArr(roleRouter, 'funUrl')
    state.asyncRouter = roleRouter;
  }
};
const actions = {
  async getMenu(context, userInfoId) {
    let menuList = await apiGet(
      adminApi.sysMenuList,
      userInfoId ? { userInfoId: userInfoId } : {}
    );
    const defaultMenuList = require('../../data/menu.json');
    let menuParentObj = {
      id: 0,
      list: []
    }
    switchTree(menuList.data, menuParentObj, 'parentId', 'list')
    // context.state.menuList = [...defaultMenuList.data, ...menuParentObj.list];
    context.state.menuList = menuParentObj.list;

    sortMenuList(context.state.menuList)
    function sortMenuList(arr) {
      arr.sort( (a, b) => {
        a.list && sortMenuList(a.list)
        return a.sortNo - b.sortNo
      })
    }
  },
  setActiveNameAction({ commit }, name) {
    commit('setActiveName', name);
  },
  setOpenNameAction({ commit }, name) {
    commit('setOpenName', name);
  },
  setBreadcrumbListAction({ commit }, name) {
    commit('setBreadcrumbList', name);
  },
  formaterRouterHandle({ commit }) {
    commit('formaterRouter');
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
