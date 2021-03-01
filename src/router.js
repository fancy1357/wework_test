import Vue from 'vue';
import VueRouter from 'vue-router';

import Login from './views/Login.vue';
import Home from './views/Home.vue';
import Welcome from './views/Welcome.vue';
import Agents from './views/agent/Agents.vue';
import Interfaces from './views/interface/Interfaces.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    // mode: 'history',
    routes: [{
            path: '/login',
            component: Login
        },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [{
                path: '/welcome',
                component: Welcome
            },{
                path: '/agents',
                component: Agents
            },{
                path: '/interfaces',
                component: Interfaces
            },]
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