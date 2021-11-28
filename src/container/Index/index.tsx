import { Button } from 'zarm'
import style from './style.module.less';

function Index() {
  return (
    <div className={style.index}>
      <span>首页</span>
      <Button theme="primary">测试</Button>
    </div>
  );
}

export default Index;