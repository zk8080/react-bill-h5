import { useState } from 'react';
import { TabBar } from 'zarm';
import style from './style.module.less';
import { useNavigate } from 'react-router-dom';

type Iprops = {
  showNav?: boolean
}


function Nav(props: Iprops) {
  const navigate = useNavigate();
  const { showNav } = props;

  const [activeKey, setActiveKey] = useState<string>('/');

  const changeTab = (path?: string | number) => {
    setActiveKey(path  as string);
    navigate(path as string);
  }

  return (
    <TabBar visible={showNav} className={style.tab} activeKey={activeKey} onChange={changeTab}>
      <TabBar.Item
        itemKey="/"
        title="账单"
      />
      <TabBar.Item
        itemKey="/data"
        title="统计"
      />
      <TabBar.Item
        itemKey="/user"
        title="我的"
      />
    </TabBar>
  );
}

export default Nav;