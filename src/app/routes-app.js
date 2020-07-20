import store from '@/state/store'

export default [
  {
    path: '/',
    name: 'Customer',
    meta: {
      authRequired: true,
    },
    component: () => import('../router/views/layout/customer'),
  },
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
  },
  {
    path: '/taxes/list',
    name: 'taxes list',
    meta: {
      authRequired: true,
    },
    component: () => import('./admin/product/taxes-list'),
  },
  {
    path: '/origin/list',
    name: 'origin list',
    meta: {
      authRequired: true,
    },
    component: () => import('./admin/product/origin-list'),
  },
  {
    path: '/unit/list',
    name: 'Unit list',
    meta: {
      authRequired: true,
    },
    component: () => import('./admin/product/unit-list'),
  },


  {
    path: '/login',
    name: 'login',
    component: () => import('../router/views/account/login'),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters['auth/loggedIn']) {
          // Redirect to the home page instead
          next({ name: 'home' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../router/views/account/register'),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters['auth/loggedIn']) {
          // Redirect to the home page instead
          next({ name: 'home' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/verify-email/:verify(.*)*',
    name: 'Verify Email',
    meta: {
      authRequired: true,
    },
    component: () => import('../router/views/account/verify-email'),
  },

  {
    path: '/supplier/list',
    name: 'supplier list',
    meta: {
      authRequired: true,
    },
    component: () => import('./admin/supplier/supplier-list'),
  },
  {
    path: '/supplier/create',
    name: 'supplier Detail',
    meta: {
      authRequired: true,
    },
    component: () => import('./admin/supplier/supplier-detail'),
  },
  {
    path: '/supplier/detail/:id',
    name: 'supplier Detail',
    meta: {
      authRequired: true,
    },
    component: () => import('./admin/supplier/supplier-detail'),
  },
  {
    path: '/order/retail',
    name: 'Order list',
    meta: {
      authRequired: true,
    },
    component: () => import('./admin/order/order-list'),
  },
  {
    path: '/order/wholesale',
    name: 'Order list',
    meta: {
      authRequired: true,
    },
    component: () => import('./admin/order/order-list'),
  },
  {
    path: '/order/auction',
    name: 'Order list',
    meta: {
      authRequired: true,
    },
    component: () => import('./admin/order/order-list'),
  },
  {
    path: '/order/paymentpartner',
    name: 'Order list',
    meta: {
      authRequired: true,
    },
    component: () => import('./admin/order/order-list'),
  },
  {
    path: '/order/shippingpartner',
    name: 'Order list',
    meta: {
      authRequired: true,
    },
    component: () => import('./admin/order/order-list'),
  },
  {
    path: '/order/:create-(.*)*',
    name: 'Create Order',
    meta: {
      authRequired: true,
    },
    component: () => import('./admin/order/order-create'),
  },
  {
    path: '/order/:id',
    name: 'Order detail',
    meta: {
      authRequired: true,
    },
    component: () => import('./admin/order/order-detail'),
  },
  {
    path: '/create-order',
    name: 'Order detail',
    meta: {
      authRequired: true,
    },
    component: () => import('./page/customer/create-order'),
  },
  // {
  //   path: '/order-buy/list',
  //   name: 'Đơn mua hàng',
  //   meta: {
  //     authRequired: true,
  //   },
  //   component: () => import('./admin/order-buy/order-buy-list'),
  // },
  // {
  //   path: '/order-buy/:id',
  //   name: 'Đơn mua hàng',
  //   meta: {
  //     authRequired: true,
  //   },
  //   component: () => import('./admin/order-buy/order-buy-detail'),
  // },
  // {
  //   path: '/order/order-seller',
  //   name: 'Đơn hàng',
  //   meta: {
  //     authRequired: true,
  //   },
  //   component: () => import('./admin/order/order-seller/order-seller-list'),
  // },
  // {
  //   path: '/order/order-buyer/detail/:id',
  //   name: 'Đơn hàng',
  //   meta: {
  //     authRequired: true,
  //   },
  //   component: () => import('./admin/order/order-buyer/order-buyer-detail'),
  // },
  // {
  //   path: '/order/order-buyer',
  //   name: 'Đơn hàng',
  //   meta: {
  //     authRequired: true,
  //   },
  //   component: () => import('./admin/order/order-buyer/order-buyer-list'),
  // },
  {
    path: '/transaction/list',
    name: 'Giao dịch',
    meta: {
      authRequired: true,
    },
    component: () => import('./admin/transaction/transaction-list'),
  },
  {
    path: '/transaction/detail/:id',
    name: 'Giao dịch',
    meta: {
      authRequired: true,
    },
    component: () => import('./admin/transaction/transaction-detail'),
  },
  {
    path: '/cart-list',
    name: 'Cart',
    meta: {
      authRequired: true,
    },
    component: () => import('./page/customer/cart-list'),
  },
  {
    path: '/past-cart',
    name: 'Cart',
    meta: {
      authRequired: true,
    },
    component: () => import('./page/customer/cart-past'),
  },

  {
    path: '/finance',
    name: 'Giao dịch',
    meta: {
      authRequired: true,
    },
    component: () => import('./page/customer/finance'),
  },
  {
    path: '/order-retail',
    name: 'Đơn lẻ',
    meta: {
      authRequired: true,
    },
    component: () => import('./page/customer/order'),
  },
  {
    path: '/order-wholesale',
    name: 'Đơn sỉ',
    meta: {
      authRequired: true,
    },
    component: () => import('./page/customer/order'),
  },
  {
    path: '/order-auction',
    name: 'Đơn đấu giá',
    meta: {
      authRequired: true,
    },
    component: () => import('./page/customer/order'),
  },
  {
    path: '/order-paymentpartner',
    name: 'Đơn thanh toán hộ',
    meta: {
      authRequired: true,
    },
    component: () => import('./page/customer/order'),
  },
  {
    path: '/order-shippingpartner',
    name: 'Đơn vận chuyển',
    meta: {
      authRequired: true,
    },
    component: () => import('./page/customer/order'),
  },
  {
    path: '/order-detail/:id',
    name: 'Chi tiết',
    meta: {
      authRequired: true,
    },
    component: () => import('./page/customer/order-detail'),
  },
  {
    path: '/create-retail',
    name: 'Chi tiết',
    meta: {
      authRequired: true,
    },
    component: () => import('./page/customer/create-order'),
  },
  {
    path: '/create-wholesale',
    name: 'Chi tiết',
    meta: {
      authRequired: true,
    },
    component: () => import('./page/customer/create-order'),
  },
  {
    path: '/create-auction',
    name: 'Chi tiết',
    meta: {
      authRequired: true,
    },
    component: () => import('./page/customer/create-order'),
  },
  {
    path: '/create-payment',
    name: 'Chi tiết',
    meta: {
      authRequired: true,
    },
    component: () => import('./page/customer/create-order'),
  },
  {
    path: '/create-shipping',
    name: 'Chi tiết',
    meta: {
      authRequired: true,
    },
    component: () => import('./page/customer/create-order'),
  },
  {
    path: '/user/list',
    name: 'Người dùng',
    meta: {
      authRequired: true,
    },
    component: () => import('../router/views/users/user-list'),
  },
  {
    path: '/user/detail/:id',
    name: 'Người dùng',
    meta: {
      authRequired: true,
    },
    component: () => import('../router/views/users/user-detail'),
  },
  {
    path: '/forgot-password',
    name: 'Forgot password',
    component: () => import('../router/views/account/forgot-password'),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters['auth/loggedIn']) {
          // Redirect to the home page instead
          next({ name: 'home' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/logout',
    name: 'logout',
    meta: {
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        store.dispatch('auth/logOut')
        const authRequiredOnPreviousRoute = routeFrom.matched.some(
            (route) => route.push('/login')
        )
        // Navigate back to previous page, or home as a fallback
        next(authRequiredOnPreviousRoute ? { name: 'home' } : { ...routeFrom })
      },
    },
  },
  {
    path: '/404',
    name: '404',
    component: require('../router/views/utility/404').default,
  },
  // Redirect any unmatched routes to the 404 page. This may
  // require some server configuration to work in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  // {
  //   path: '*',
  //   redirect: '404',
  // },
  {
    path: '/calendar',
    name: 'Calendar',
    meta: { authRequired: true },
    component: () => import('../router/views/calendar/calendar')
  },
  {
    path: '/ecommerce/products',
    name: 'Products',
    meta: { authRequired: true },
    component: () => import('../router/views/ecommerce/products')
  },
  {
    path: '/ecommerce/product-detail',
    name: 'Product Detail',
    meta: { authRequired: true },
    component: () => import('../router/views/ecommerce/product-detail')
  },
  {
    path: '/ecommerce/orders',
    name: 'Orders',
    meta: { authRequired: true },
    component: () => import('../router/views/ecommerce/orders')
  },
  {
    path: '/ecommerce/customers',
    name: 'Customers',
    meta: { authRequired: true },
    component: () => import('../router/views/ecommerce/customers')
  },
  {
    path: '/ecommerce/cart',
    name: 'Cart',
    meta: { authRequired: true },
    component: () => import('../router/views/ecommerce/cart')
  },
  {
    path: '/ecommerce/checkout',
    name: 'Checkout',
    meta: { authRequired: true },
    component: () => import('../router/views/ecommerce/checkout')
  },
  {
    path: '/ecommerce/shops',
    name: 'Shops',
    meta: { authRequired: true },
    component: () => import('../router/views/ecommerce/shops')
  },
  {
    path: '/ecommerce/add-product',
    name: 'Add Product',
    meta: { authRequired: true },
    component: () => import('../router/views/ecommerce/add-product')
  },
  {
    path: '/invoices/detail',
    name: 'Invoice Detail',
    meta: { authRequired: true },
    component: () => import('../router/views/invoices/detail')
  },
  {
    path: '/invoices/list',
    name: 'Invoice List',
    meta: { authRequired: true },
    component: () => import('../router/views/invoices/list')
  },
  {
    path: '/ui/alerts',
    name: 'Alerts',
    meta: {
      authRequired: true
    },
    component: () => import('../router/views/ui/alerts')
  },
  {
    path: '/ui/buttons',
    name: 'Buttons',
    meta: {
      authRequired: true
    },
    component: () => import('../router/views/ui/buttons')
  },
  {
    path: '/ui/cards',
    name: 'Cards',
    meta: { authRequired: true },
    component: () => import('../router/views/ui/cards')
  },
  {
    path: '/ui/carousel',
    name: 'Carousel',
    meta: { authRequired: true },
    component: () => import('../router/views/ui/carousel')
  },
  {
    path: '/ui/dropdowns',
    name: 'Dropdowns',
    meta: { authRequired: true },
    component: () => import('../router/views/ui/dropdowns')
  },
  {
    path: '/ui/grid',
    name: 'Grid',
    meta: { authRequired: true },
    component: () => import('../router/views/ui/grid')
  },
  {
    path: '/ui/images',
    name: 'Images',
    meta: { authRequired: true },
    component: () => import('../router/views/ui/images')
  },
  {
    path: '/ui/modals',
    name: 'Modals',
    meta: { authRequired: true },
    component: () => import('../router/views/ui/modals')
  },
  {
    path: '/ui/rangeslider',
    name: 'Rangeslider',
    meta: { authRequired: true },
    component: () => import('../router/views/ui/rangeslider')
  },
  {
    path: '/ui/progressbars',
    name: 'Progressbars',
    meta: { authRequired: true },
    component: () => import('../router/views/ui/progressbars')
  },
  {
    path: '/ui/sweet-alert',
    name: 'Sweet-alert',
    meta: { authRequired: true },
    component: () => import('../router/views/ui/sweet-alert')
  },
  {
    path: '/ui/tabs-accordions',
    name: 'Tabs-accordions',
    meta: { authRequired: true },
    component: () => import('../router/views/ui/tabs-accordions')
  },
  {
    path: '/ui/typography',
    name: 'Typography',
    meta: { authRequired: true },
    component: () => import('../router/views/ui/typography')
  },
  {
    path: '/ui/video',
    name: 'Video',
    meta: { authRequired: true },
    component: () => import('../router/views/ui/video')
  },
  {
    path: '/ui/general',
    name: 'General',
    meta: { authRequired: true },
    component: () => import('../router/views/ui/general')
  },
  {
    path: '/ui/colors',
    name: 'Colors',
    meta: { authRequired: true },
    component: () => import('../router/views/ui/colors')
  },
  {
    path: '/projects/grid',
    name: 'Projects Grid',
    meta: { authRequired: true },
    component: () => import('../router/views/projects/projects-grid')
  },
  {
    path: '/projects/list',
    name: 'Projects List',
    meta: { authRequired: true },
    component: () => import('../router/views/projects/projects-list')
  },
  {
    path: '/projects/overview',
    name: 'Project Overview',
    meta: { authRequired: true },
    component: () => import('../router/views/projects/overview')
  },
  {
    path: '/projects/create',
    name: 'Create New',
    meta: { authRequired: true },
    component: () => import('../router/views/projects/create')
  },
  {
    path: '/contacts/group-permission',
    name: 'Group Permission',
    meta: { authRequired: true },
    component: () => import('../router/views/contacts/group-permission')
  },
  {
    path: '/contacts/grid',
    name: 'User Grid',
    meta: { authRequired: true },
    component: () => import('../router/views/contacts/contacts-grid')
  },
  {
    path: '/contacts/list',
    name: 'User List',
    meta: { authRequired: true },
    component: () => import('../router/views/contacts/contacts-list')
  },
  {
    path: '/contacts/profile',
    name: 'Profile',
    meta: { authRequired: true },
    component: () => import('../router/views/contacts/contacts-profile')
  },
  {
    path: '/charts/apex',
    name: 'Apex chart',
    meta: { authRequired: true },
    component: () => import('../router/views/charts/apex')
  },
  {
    path: '/charts/chartjs',
    name: 'Chartjs chart',
    meta: { authRequired: true },
    component: () => import('../router/views/charts/chartjs/index')
  },
  {
    path: '/charts/chartist',
    name: 'Chartist chart',
    meta: { authRequired: true },
    component: () => import('../router/views/charts/chartist')
  },
  {
    path: '/icons/boxicons',
    name: 'Boxicons Icon',
    meta: { authRequired: true },
    component: () => import('../router/views/icons/boxicons')
  },
  {
    path: '/icons/materialdesign',
    name: 'Materialdesign Icon',
    meta: { authRequired: true },
    component: () => import('../router/views/icons/materialdesign')
  },
  {
    path: '/icons/dripicons',
    name: 'Dripicons Icon',
    meta: { authRequired: true },
    component: () => import('../router/views/icons/dripicons')
  },
  {
    path: '/icons/fontawesome',
    name: 'Fontawesome Icon',
    meta: { authRequired: true },
    component: () => import('../router/views/icons/fontawesome')
  },
  {
    path: '/maps/google',
    name: 'Google Maps',
    meta: { authRequired: true },
    component: () => import('../router/views/maps/google')
  },
  {
    path: '/tables/basictable',
    name: 'Basic Tables',
    meta: { authRequired: true },
    component: () => import('../router/views/tables/basictable')
  },
  {
    path: '/tables/advancedtable',
    name: 'Advanced Tables',
    meta: { authRequired: true },
    component: () => import('../router/views/tables/advancedtable')
  },
  {
    path: '/form/advanced',
    name: 'Form Advanced',
    meta: { authRequired: true },
    component: () => import('../router/views/forms/advanced')
  },
  {
    path: '/form/elements',
    name: 'Form Elements',
    meta: { authRequired: true },
    component: () => import('../router/views/forms/elements')
  },
  {
    path: '/form/editor',
    name: 'CK Editor',
    meta: { authRequired: true },
    component: () => import('../router/views/forms/ckeditor')
  },
  {
    path: '/form/uploads',
    name: 'File Uploads',
    meta: { authRequired: true },
    component: () => import('../router/views/forms/uploads')
  },
  {
    path: '/form/validation',
    name: 'Form Validation',
    meta: { authRequired: true },
    component: () => import('../router/views/forms/validation')
  },
  {
    path: '/form/wizard',
    name: 'Form Wizard',
    meta: { authRequired: true },
    component: () => import('../router/views/forms/wizard')
  },
  {
    path: '/form/repeater',
    name: 'Form Repeater',
    meta: { authRequired: true },
    component: () => import('../router/views/forms/repeater')
  },
  {
    path: '/form/mask',
    name: 'Form Mask',
    meta: { authRequired: true },
    component: () => import('../router/views/forms/mask')
  },
  {
    path: '/pages/starter',
    name: 'Starter',
    meta: { authRequired: true },
    component: () => import('../router/views/utility/starter')
  },
  {
    path: '/pages/maintenance',
    name: 'Maintenance',
    meta: { authRequired: true },
    component: () => import('../router/views/utility/maintenance')
  },
  {
    path: '/pages/timeline',
    name: 'Timeline',
    meta: { authRequired: true },
    component: () => import('../router/views/utility/timeline')
  },
  {
    path: '/pages/faqs',
    name: 'FAQs',
    meta: { authRequired: true },
    component: () => import('../router/views/utility/faqs')
  },
  {
    path: '/pages/pricing',
    name: 'Pricing',
    meta: { authRequired: true },
    component: () => import('../router/views/utility/pricing')
  },
  {
    path: '/pages/404',
    name: 'Error-404',
    meta: { authRequired: true },
    component: () => import('../router/views/utility/404')
  },
  {
    path: '/pages/500',
    name: 'Error-500',
    meta: { authRequired: true },
    component: () => import('../router/views/utility/500')
  },
  {
    path: '/email/inbox',
    name: 'Inbox',
    meta: { authRequired: true },
    component: () => import('../router/views/email/inbox')
  },
  {
    path: '/email/reademail',
    name: 'Read Email',
    meta: { authRequired: true },
    component: () => import('../router/views/email/reademail')
  },
  {
    path: '/tasks/list',
    name: 'Task list',
    meta: { authRequired: true },
    component: () => import('../router/views/tasks/task-list')
  },
  {
    path: '/tasks/kanban',
    name: 'Kanbanboard',
    meta: { authRequired: true },
    component: () => import('../router/views/tasks/kanbanboard')
  },
  {
    path: '/tasks/create',
    name: 'Create Task',
    meta: { authRequired: true },
    component: () => import('../router/views/tasks/task-create')
  },
  {
    path: '/layout/horizontal',
    name: 'Horizontal',
    meta: { authRequired: true },
    component: () => import('../router/views/layout/horizontal')
  },
  {
    path: '/auth/login-1',
    name: 'Login sample',
    meta: { authRequired: true },
    component: () => import('../router/views/sample-pages/login-sample')
  },
  {
    path: '/auth/register-1',
    name: 'Register sample',
    meta: { authRequired: true },
    component: () => import('../router/views/sample-pages/register-sample')
  },
  {
    path: '/auth/recoverpw',
    name: 'Recover pwd',
    meta: { authRequired: true },
    component: () => import('../router/views/sample-pages/recoverpw-sample')
  },
  {
    path: '/auth/lock-screen',
    name: 'Lock screen',
    meta: { authRequired: true },
    component: () => import('../router/views/sample-pages/lockscreen')
  }
]
