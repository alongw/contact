import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('@/page/Home/Home.vue')
        },
        {
            path: '/form',
            name: 'Form',
            component: () => import('@/page/Form/Form.vue'),
            redirect: '/form/null',
            children: [
                {
                    path: '/form/:from',
                    name: 'FormDetail',
                    component: () => import('@/page/Form/Form.vue')
                }
            ]
        },
        {
            path: '/login_back',
            name: 'Login',
            component: () => import('@/page/Login/Login.vue')
        },
        {
            path: '/i',
            name: 'Item',
            component: () => import('@/page/Item/Item.vue'),
            redirect: {
                path: '/',
                query: {
                    from: 'item.null.redirect'
                }
            },
            children: [
                {
                    path: '/i/:iid',
                    name: 'ItemDetail',
                    component: () => import('@/page/Item/Item.vue')
                }
            ]
        },
        {
            path: '/admin',
            name: 'Admin',
            component: () => import('@/page/Admin/Admin.vue')
        }
    ]
})

export default router
