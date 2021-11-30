import { BrowserRouter, Route, Routes } from 'react-router-dom';
import routes from '@/router';
import { ConfigProvider, } from 'zarm';
import './App.css';
import Nav from './components/Nav';

function App() {
  return (
    <BrowserRouter>
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
      <Nav showNav={true}/>
    </BrowserRouter>
  )
}

export default App
