import { useNavigate } from 'react-router-dom'
import { NavBar, Icon } from 'zarm';
import style from './style.module.less'

interface IProps {
  /**
   * 头部标题
   */
  title: string;
}

const Header = (props: IProps) => {
  const { title } = props;
  const navigate = useNavigate()
  return <div className={style.headerWarp}>
    <div className={style.block}>
      <NavBar
        className={style.header}
        left={<Icon type="arrow-left" theme="primary" onClick={() => navigate(-1)} />}
        title={title}
      />
    </div>
  </div>
};

export default Header;