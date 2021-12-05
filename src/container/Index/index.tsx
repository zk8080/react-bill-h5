import { BillItemType } from '../../../global';
import { useState } from 'react';
import { Icon } from 'zarm'
import style from './style.module.less';
import BillItem from '@/components/BillItem';

function Index() {

  const [listData, setListData] = useState<BillItemType[]>([
    {
      bills: [
        {
          amount: "25.00",
          date: "1623390740000",
          id: 911,
          pay_type: 1,
          remark: "",
          type_id: 1,
          type_name: "餐饮"
        }
      ],
      date: 1638689771898
    }
  ]);

  return <div className={style.home}>
    <div className={style.header}>
      <div className={style.dataWrap}>
        <span className={style.expense}>总支出：<b>¥ 200</b></span>
        <span className={style.income}>总收入：<b>¥ 500</b></span>
      </div>
      <div className={style.typeWrap}>
        <div className={style.left}>
          <span className={style.title}>类型 <Icon className={style.arrow} type="arrow-bottom" /></span>
        </div>
        <div className={style.right}>
          <span className={style.time}>2022-06<Icon className={style.arrow} type="arrow-bottom" /></span>
        </div>
      </div>
    </div>
    <div className={style.contentWrap}>
      {
        listData.map((item, index) => <BillItem key={item.date} bill={item} />)
      }
    </div>
  </div>
}

export default Index;