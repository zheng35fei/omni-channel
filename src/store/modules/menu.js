import { apiGet } from '../../fetch/api';
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
    console.log(name);
    state.activeName = name;
  },
  setOpenName(state, name) {
    state.openName = name;
  },
  setBreadcrumbList(state, name) {
    console.log(name);
    state.breadcrumbList = name;
  },
  formaterRouter(state) {
    // 根据权限生成路由
    let roleRouter = [];
    if (!state.menuList.length) {
      return;
    }
    state.menuList.forEach(item => {
      // 根据用户权限生成路由
      let firstRouter = item.funCode;
      item.list.forEach(it => {
        let secondName = it.funName;
        let secondRouter = it.funCode;
        it.list.forEach(el => {
          let thirdName = el.funName;
          let thirdRouter = el.funCode;
          let meta = {
            breadcrumbList: [secondName, thirdName],
            belongTab: firstRouter,
            openName: secondRouter
          };
          roleRouter.push({
            path: '/' + thirdRouter,
            name: thirdRouter,
            component: resolve => {
              require([
                `@/components/${firstRouter}/${secondRouter}/${thirdRouter}`
              ], resolve);
            },
            meta: meta
          });
        });
      });
    });
    state.asyncRouter = roleRouter;
  }
};
const actions = {
  async getMenu(context, userInfoId) {
    // let menuList = await apiGet('/manage/admin/admin/menu/getMenu',userInfoId?{userInfoId:userInfoId}:{})
    let menuList = require('../../data/menu.json');
    context.state.menuList = menuList.data;
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
