/**
 * Created by Liu.Jun on 2020/5/13 8:47 下午.
 */

const routes = [
    {
        path: '/basePage',
        name: 'basePage',
        meta: {
            title: 'BasePage'
        },
        component: () => import('./views/basePage/index')
    },
    {
        path: '*',
        hidden: true,
        redirect: {
            name: 'basePage'
        }
    }
];

export default routes;
