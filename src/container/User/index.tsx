import React, { useEffect, useState } from 'react';
import { http } from '@/utils/axios';
import { Cell } from 'zarm';
import style from './style.module.less';
import CustomIcon from '@/components/CustomIcon';
import { useNavigate } from 'react-router-dom';

interface UserInfoType {
  id:        number;
  username:  string;
  signature: string;
  avatar:    string;
}

const User = () => {
  const navigate = useNavigate();
  // 用户信息
  const [user, setUser] = useState<UserInfoType>();

  // 获取用户信息
  const getUserInfo = async () => {
    try {
      const { data, code } = await http.get<UserInfoType>('/user/get_userinfo');
      if(code === 200) {
        setUser(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);


  return <div className={style.user}>
    <div className={style.head}>
      <div className={style.info}>
        <span>昵称：{user?.username}</span>
        <span>
          <img style={{ width: 30, height: 30, verticalAlign: '-10px' }} src="//s.yezgea02.com/1615973630132/geqian.png" alt="" />
          <b>{user?.signature}</b>
        </span>
      </div>
      <img className={style.avatar} style={{ width: 60, height: 60, borderRadius: 8 }} src={user?.avatar || '//s.yezgea02.com/1624959897466/avatar.jpeg'} alt="" />
   </div>
   <div className={style.content}>
      <Cell
        hasArrow
        title="用户信息修改"
        onClick={() => navigate('/userInfo')}
        icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615974766264/gxqm.png" alt="" />}
      />
      <Cell
        hasArrow
        title="重制密码"
        onClick={() => navigate('/account')}
        icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615974766264/zhaq.png" alt="" />}
      />
      <Cell
        hasArrow
        title="关于我们"
        onClick={() => navigate('/about')}
        icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615975178434/lianxi.png" alt="" />}
      />
    </div>
  </div>
}

export default User