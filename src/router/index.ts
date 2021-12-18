import Index from '@/container/Index';
import Data from "@/container/Data";
import User from '@/container/User';
import Detail from '@/container/Detail';
import Login from '@/container/Login';
import UserInfo from '@/container/UserInfo';
import Account from '@/container/Account';

const routes = [
  {
    path: '/',
    component: Index,
  },
  {
    path: '/data',
    component: Data,
  },
  {
    path: '/user',
    component: User,
  },
  {
    path: '/detail',
    component: Detail,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/userInfo',
    component: UserInfo,
  },
  {
    path: '/account',
    component: Account,
  },
]

export default routes;
