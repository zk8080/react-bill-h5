import Index from '@/container/Index';
import Data from "@/container/Data";
import User from '@/container/User';

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
]

export default routes;
