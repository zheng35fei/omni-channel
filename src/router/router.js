// 不作为Main组件的子页面展示的页面单独写，如下
import Main from '@/components/main';
export const loginRouter = [
  {
    path: '/',
    redirect: {
      name: 'login'
    }
  },
  {
    path: '/base',
    redirect: {
      name: 'publishPark'
    }
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: resolve => {
      require(['@/components/LoginForm.vue'], resolve);
    }
  },
  {
    path: '/adminLogin',
    name: 'adminLogin',
    meta: {
      title: '登录'
    },
    component: resolve => {
      require(['@/components/LoginForm.vue'], resolve);
    }
  },
  {
    path: '/404',
    name: '404',
    component: resolve => {
      require(['@/components/nofound'], resolve);
    }
  },
  {
    path: '/mainDefault',
    name: ' MainDefault',
    component: Main,
    children: [
      {
        path: '/addMenu',
        name: 'addmenu',
        meta: {
          breadcrumbList: ['菜单管理', '菜单管理'],
          belongTab: 'system',
          openName: 'account'
        },
        component: resolve => {
          require(['@/components/system/addMenu'], resolve);
        }
      },
      {
        path: '/menu',
        name: 'menu',
        meta: {
          breadcrumbList: ['菜单管理', '菜单管理'],
          belongTab: 'system',
          openName: 'account'
        },
        component: resolve => {
          require(['@/components/system/menu'], resolve);
        }
      },
      {
        path: '/modifyPwd',
        name: 'password',
        meta: {
          breadcrumbList: ['修改密码'],
          belongTab: 'system',
          openName: 'account'
        },
        component: resolve => {
          require(['@/components/system/account/password.vue'], resolve);
        }
      }
    ]
  }
];
// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  ...loginRouter
  // otherRouter,
];
