import Vue from 'vue';
import VueRouter from 'vue-router';

import Login from './views/Login.vue';
import Home from './views/Home.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    // mode: 'history',
    routes: [
        {
            path: '/login',
            component: Login
        },
        {
            path: '/home',
            component: Home
        },
    ]
});

router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();

    const token = window.sessionStorage.getItem('token');
    if (!token) return next('/login');
    next();
});

export default router;