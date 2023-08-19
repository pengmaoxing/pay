import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode:'history',
  // base: '/history',
  routes: [
    {
      path: '/',
      name: 'index',
      // redirect: '/',
      component: () => import('@/modules/index')
    },
    // {
    //   path: '/wx/:wxId',
    //   name: 'wx',
    //   component: () => import('@/modules/wx/paySelect')
    // },
    // {
    //   path: '/zfb/:zfbId',
    //   name: 'zfb',
    //   component: () => import('@/modules/zfb/paySuccess')
    // },
    {
      path: '/qrcode',
      name: 'qrcode',
      component: () => import('@/modules/qrcode')
    },
    {
      path: '/wx/paySelect',
      name: 'paySelect',
      component: () => import('@/modules/wx/paySelect')
    },
    {
      path: '/wx/pay',
      name: 'pay',
      component: () => import('@/modules/wx/pay')
    },
    {
      path: '/wx/paySuccess',
      name: 'paySuccess',
      component: () => import('@/modules/wx/paySuccess')
    },
    {
      path: '/wx/payError',
      name: 'payError',
      component: () => import('@/modules/wx/payError')
    },
    {
      path: '/wx/memberCard',
      name: 'memberCard',
      component: () => import('@/modules/wx/memberCard')
    },
    {
      path: '/wx/memberDetails',
      name: 'memberDetails',
      component: () => import('@/modules/wx/memberDetails')
    },
    {
      path: '/wx/thirdPay',
      name: 'thirdPay',
      component: () => import('@/modules/wx/thirdPay')
    },
    {
      path: '/wx/memberServiceAgreement',
      name: 'memberServiceAgreement',
      component: () => import('@/modules/wx/memberServiceAgreement')
    },
    {
      path: '/zfb/paySuccess',
      name: 'zfb',
      component: () => import('@/modules/zfb/paySuccess')
    },
    {
      path: '/advertisement',
      name: 'advertisement',
      component: () => import('@/modules/advertisement')
    },
    {
      path: '/zfb/advertisement',
      name: 'zfbAdvertisement',
      component: () => import('@/modules/zfb/advertisement')
    },
    {
      path: '/zfb/paySuccessYes',
      name: 'paySuccessYes',
      component: () => import('@/modules/zfb/paySuccessYes')
    },
    {
      path: '/zfb/thirdPay',
      name: 'thirdPay',
      component: () => import('@/modules/zfb/thirdPay')
    },
    {
      // 会匹配所有路径
      path: '*',
      name: '404',
      component: () => import('@/modules/notfound/index')
    }
  ]
})

