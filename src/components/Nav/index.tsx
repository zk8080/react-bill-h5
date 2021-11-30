import { useState } from 'react';
import { TabBar } from 'zarm';
import style from './style.module.less';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomIcon from '../CustomIcon';

type Iprops = {
  showNav?: boolean
}


function Nav(props: Iprops) {
  const location = useLocation();
  const navigate = useNavigate();
  const { showNav } = props;

  const [activeKey, setActiveKey] = useState<string>(location.pathname);

  const changeTab = (path?: string | number) => {
    setActiveKey(path  as string);
    navigate(path as string);
  }

  return (
    <TabBar visible={showNav} className={style.tab} activeKey={activeKey} onChange={changeTab}>
      <TabBar.Item
        itemKey="/"
        title="账单"
        icon={<CustomIcon type="zhangdan" />}
      />
      <TabBar.Item
        itemKey="/data"
        title="统计"
        icon={<CustomIcon type="tongji" />}
      />
      <TabBar.Item
        itemKey="/user"
        title="我的"
        icon={<CustomIcon type="wode" />}
      />
    </TabBar>
  );
}

export default Nav;