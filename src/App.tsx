import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import routes from '@/router';
import { ConfigProvider } from 'zarm';
import './App.css';
import Nav from './components/Nav';
import { useEffect, useState } from 'react';

const needNav = ['/', '/data', '/user'] // 需要底部导航栏的路径

function App() {

  const location = useLocation() // 拿到 location 实例
  const { pathname } = location // 获取当前路径
  const [showNav, setShowNav] = useState(false) // 是否展示 Nav

  useEffect(() => {
    setShowNav(needNav.includes(pathname))
  }, [pathname]) // [] 内的参数若是变化，便会执行上述回调函数=

  return (
    <>
      <ConfigProvider primaryColor={'#007fff'}>
        <Routes>
          {
            routes.map(item => {
              return (
                <Route key={item.path} element={<item.component />} path={item.path} />
              )
            })
          }
        </Routes>
      </ConfigProvider>
      <Nav showNav={showNav}/>
    </>
  )
}

export default App
