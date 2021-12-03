import { useState, useCallback } from 'react';
import CustomIcon from '@/components/CustomIcon';
import { Button, Cell, Checkbox, Input, Toast } from 'zarm';
import style from './style.module.less';
import Captcha from "react-captcha-code";
import { http } from '@/utils/axios';
import classNames from 'classnames';

interface LoginData {
  token: string
}

const Login = () => {
  // 账号
  const [username, setUsername] = useState<string | undefined>();
  // 密码
  const [password, setPassword] = useState<string | undefined>();
  // 验证码
  const [verifyCode, setVerifyCode] = useState<string | undefined>();
  // 校验的验证码
  const [captchaCode, setCaptchaCode] = useState<string>('');
  // 登录注册类型
  const [type, setType] = useState<'login' | 'register'>('login');

  // 存储验证码图片中的验证码数据
  const handleCaptchaChange = useCallback((captcha: string) => {
    setCaptchaCode(captcha);
  }, [])

  // 注册账号
  const handleRegistry = async () => {
    try {
      if (!username) {
        Toast.show('请输入账号')
        return
      }
      if (!password) {
        Toast.show('请输入密码')
        return
      }
      if (!verifyCode) {
        Toast.show('请输入验证码')
        return
      };
      if (verifyCode !== captchaCode) {
        Toast.show('验证码错误')
        return
      };
      const params = {
        username,
        password
      }
      const res = await http.post<null>("/user/register", params);
      Toast.show("注册成功");
    } catch (e) {
      console.log(e, '--e--');
    }
  }

  // 登录
  const handleLogin = async () => {
    try {
      if (!username) {
        Toast.show('请输入账号')
        return
      }
      if (!password) {
        Toast.show('请输入密码')
        return
      }
      const params = {
        username,
        password
      }
      const res = await http.post<LoginData>("/user/login", params);
      if(res.code === 200) {
        // 将 token 写入 localStorage
        localStorage.setItem('token', res.data.token);
        Toast.show("登录成功");
      }
      
    } catch (e) {
      console.log(e, '--e--');
    }
  }

  return <div className={style.auth}>
    <div className={style.head} />
    <div className={style.tab}>
      <span className={classNames({ [style.avtive]: type == 'login' })} onClick={() => setType('login')}>登录</span>
      <span className={classNames({ [style.avtive]: type === 'register' })} onClick={() => setType('register')}>注册</span>
    </div>
    <div className={style.form}>
      <Cell icon={<CustomIcon type="zhanghao" />}>
        <Input
          clearable
          type="text"
          placeholder="请输入账号"
          onChange={(val?: string) => { setUsername(val) }}
        />
      </Cell>
      <Cell icon={<CustomIcon type="mima" />}>
        <Input
          clearable
          type="password"
          placeholder="请输入密码"
          onChange={(val?: string) => { setPassword(val) }}
        />
      </Cell>
      {
        type === 'register' && (
          <Cell icon={<CustomIcon type="mima" />}>
            <Input
              clearable
              type="text"
              placeholder="请输入验证码"
              onChange={(val?: string) => { setVerifyCode(val) }}
            />
            <Captcha charNum={4} onChange={handleCaptchaChange} />
          </Cell>
        )
      }
    </div>
    <div className={style.operation}>
      {
        type === 'register' && (
          <div className={style.agree}>
            <Checkbox />
            <label className="text-light">阅读并同意<a>《掘掘手札条款》</a></label>
          </div>
        )
      }
      {
        type === 'register' && (
          <Button block theme="primary" onClick={handleRegistry}>注册</Button>
        )
      }
      {
        type === 'login' && (
          <Button block theme="primary" onClick={handleLogin}>登录</Button>
        )
      }
    </div>
  </div>
}


export default Login;