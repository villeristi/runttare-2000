import Home from './components/Home/home';
import Users from './components/Users/users';
import NotFound from './components/NotFound/notFound';

export default [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/hall-of-shame',
    component: Users,
  },
  {
    path: '*',
    component: NotFound,
  },
];
