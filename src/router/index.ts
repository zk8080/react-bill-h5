import Index from '@/container/Index';
import Data from "@/container/Data";
import User from '@/container/User';
import Detail from '@/container/Detail';

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
]

export default routes;
