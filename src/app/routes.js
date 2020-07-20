
export default [
  // {
  //   path: '/',
  //   name: 'Customer',
  //   meta: {
  //     authRequired: true,
  //   },
  //   component: () => import('./views/layout/customer'),
  // },
  {
    path: '/admin',
    name: 'home',
    meta: {
      authRequired: true,
    },
    component: () => import('./admin/home'),
  },

  {
    path: '/product/list',
    name: 'Product List',
    meta: {
      authRequired: true,
    },
    component: () => import('./admin/product/product-list'),
  },
  {
    path: '/product/detail/:id',
    name: 'Product Detail',
    meta: {
      authRequired: true,
    },
    component: () => import('./admin/product/product-detail'),
  },
  {
    path: '/product/create',
    name: 'Product Detail',
    meta: {
      authRequired: true,
    },
    component: () => import('./admin/product/product-detail'),
  }
]
