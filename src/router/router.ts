import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import headLine from './headLine/index'
import channel from './channel/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/headLine'
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    },
    ...headLine,
    ...channel
  ]
})
