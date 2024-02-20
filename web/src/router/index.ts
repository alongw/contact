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
        }
    ]
})

export default router
